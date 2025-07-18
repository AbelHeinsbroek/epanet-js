import { describe, expect, it } from "vitest";
import { MomentLog, generateStateId, initId } from "./moment-log";
import { fMoment } from "./moment";

describe("MomentLog", () => {
  it("registers to the history of moments", () => {
    const { forward, reverse, stateId } = anAction();
    const momentLog = new MomentLog();

    momentLog.append(forward, reverse, stateId);

    expect(momentLog.last()).toEqual(forward);
    expect(momentLog.nextUndo()).toEqual({ stateId: initId, moment: reverse });
    expect(momentLog.nextRedo()).toEqual(null);
  });

  it("can undo / redo ", () => {
    const { forward, reverse, stateId } = anAction();
    const momentLog = new MomentLog();
    momentLog.append(forward, reverse, stateId);

    momentLog.undo();

    expect(momentLog.last()).toEqual(null);
    expect(momentLog.nextUndo()).toEqual(null);
    expect(momentLog.nextRedo()).toEqual({ moment: forward, stateId });

    momentLog.redo();

    expect(momentLog.last()).toEqual(forward);
    expect(momentLog.nextUndo()).toEqual({ moment: reverse, stateId: initId });
    expect(momentLog.nextRedo()).toEqual(null);
  });

  it("does nothing when cannot undo more", () => {
    const { forward, reverse, stateId } = anAction();
    const momentLog = new MomentLog();
    momentLog.append(forward, reverse, stateId);

    momentLog.undo();

    expect(momentLog.last()).toEqual(null);
    expect(momentLog.nextUndo()).toEqual(null);
    expect(momentLog.nextRedo()).toEqual({ moment: forward, stateId });

    momentLog.undo();

    expect(momentLog.last()).toEqual(null);
    expect(momentLog.nextUndo()).toEqual(null);
    expect(momentLog.nextRedo()).toEqual({ moment: forward, stateId });
  });

  it("does nothing when cannot redo more", () => {
    const { forward, reverse } = anAction();
    const momentLog = new MomentLog();
    momentLog.append(forward, reverse);

    momentLog.undo();

    momentLog.redo();
    momentLog.redo();

    expect(momentLog.last()).toEqual(forward);
    expect(momentLog.nextUndo()).toEqual({ moment: reverse, stateId: initId });
    expect(momentLog.nextRedo()).toEqual(null);
  });

  it("rewrites future when undo and doing changes", () => {
    const firstAction = anAction("FIRST");
    const momentLog = new MomentLog();
    momentLog.append(firstAction.forward, firstAction.reverse);

    const secondAction = anAction("SECOND");
    momentLog.append(secondAction.forward, secondAction.reverse);

    momentLog.undo();

    const thirdAction = anAction("THIRD");
    momentLog.append(thirdAction.forward, thirdAction.reverse);

    expect(momentLog.last()).toEqual(thirdAction.forward);

    momentLog.undo();
    expect(momentLog.last()).toEqual(firstAction.forward);

    momentLog.redo();
    expect(momentLog.last()).toEqual(thirdAction.forward);
  });

  it("can define a snapshot as initial state", () => {
    const importMoment = anAction("IMPORT").forward;
    const momentLog = new MomentLog();
    momentLog.setSnapshot(importMoment, "s-0");

    const snapshot = momentLog.getSnapshot();
    expect(snapshot!.moment).toEqual(importMoment);
    expect(snapshot!.stateId).toEqual("s-0");

    expect(momentLog.nextUndo()).toBeNull();

    const firstAction = anAction("FIRST");
    momentLog.append(firstAction.forward, firstAction.reverse);

    momentLog.undo();

    expect(momentLog.nextUndo()).toBeNull();

    const copy = momentLog.copy();

    const snapshotCopy = copy.getSnapshot();
    expect(snapshotCopy!.moment).toEqual(importMoment);
    expect(snapshotCopy!.stateId).toEqual("s-0");
  });

  it("can obtain deltas after a snapshot", () => {
    const importMoment = anAction("IMPORT").forward;
    const momentLog = new MomentLog();
    momentLog.setSnapshot(importMoment, "s-0");

    const firstAction = anAction("FIRST");
    momentLog.append(firstAction.forward, firstAction.reverse);

    const deltas = momentLog.getDeltas();
    expect(deltas).toHaveLength(1);
    const delta = deltas[0];
    expect(delta).toEqual(firstAction.forward);
    const copy = momentLog.copy();

    expect(copy.getDeltas()).toEqual(deltas);
  });

  const anAction = (name = "ANY_ACTION") => {
    return {
      stateId: generateStateId(),
      forward: aMoment(name + "_forward"),
      reverse: aMoment(name + "_reverse"),
    };
  };

  const aMoment = (name: string) => {
    return fMoment(name);
  };
});
