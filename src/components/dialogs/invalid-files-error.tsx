import type { ConvertResult } from "src/types/export";
import { DialogHeader } from "src/components/dialog";
import { useTranslate } from "src/hooks/use-translate";
import { CrossCircledIcon } from "@radix-ui/react-icons";

import { SimpleDialogActions } from "src/components/dialog";
import { useShowWelcome } from "src/commands/show-welcome";
import { Form, Formik } from "formik";

export type OnNext = (arg0: ConvertResult | null) => void;

export function InvalidFilesErrorDialog({ onClose }: { onClose: () => void }) {
  const translate = useTranslate();
  const showWelcome = useShowWelcome();
  return (
    <>
      <DialogHeader
        title={translate("failedToOpenModel")}
        titleIcon={CrossCircledIcon}
        variant="danger"
      />
      <Formik onSubmit={() => onClose()} initialValues={{}}>
        <Form>
          <div className="text-sm">
            <p>{translate("failedToOpenModelDetail")}</p>
          </div>
          <SimpleDialogActions
            autoFocusSubmit={true}
            action={translate("understood")}
            secondary={{
              action: translate("seeDemoNetworks"),
              onClick: () => showWelcome({ source: "invalidFilesError" }),
            }}
          />
        </Form>
      </Formik>
    </>
  );
}
