import type { ISymbology } from "src/types";
import { IDMap } from "src/lib/id_mapper";
import { Promisable } from "type-fest";
import { z } from "zod";
import { HydraulicModel, ModelMoment } from "src/hydraulic-model";
import { ModelMetadata } from "src/model-metadata";

export type PersistenceMetadataMemory = {
  type: "memory";
  symbology: ISymbology;
  label: string | null;
  layer: any;
};

export type PersistenceMetadata = PersistenceMetadataMemory;

export interface TransactOptions {
  quiet?: boolean;
}

export const EditWrappedFeatureCollection = z.object({
  id: z.string(),
  name: z.optional(z.string()),
  label: z.optional(z.string()),
  layerId: z.optional(z.number().int().nullable()),
  defaultLayer: z.any(),
  access: z.any(),
  symbology: z.any(),
  wrappedFeatureCollectionFolderId: z.string().uuid().nullable().optional(),
});

export type MetaUpdatesInput = Omit<
  z.infer<typeof EditWrappedFeatureCollection>,
  "id"
>;

export type MetaPair = [
  PersistenceMetadata,
  (updates: MetaUpdatesInput) => Promisable<void>,
];

export interface IPersistence {
  idMap: IDMap;

  useHistoryControl(): (direction: "undo" | "redo") => void;

  useTransact(): (moment: ModelMoment) => void;
  useTransactImport(): (
    hydraulicModel: HydraulicModel,
    modelMetadata: ModelMetadata,
    name: string,
  ) => void;
}
