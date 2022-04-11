import {
  useModalAction,
  useModalState,
} from "@components/ui/modal/modal.context";
import { useTranslation } from "next-i18next";
import cn from "classnames";
import { useDeleteProductMutation } from "@data/product/product-delete.mutation";

import Button from "@components/ui/button";
import StepsBar from "@components/ui/steps-bar";
import { ArrowPrev } from "../icons/arrow-prev";
import { ArrowNext } from "../icons/arrow-next";
import CreateOrUpdateProductFormStepped from "./product-form-stepped";
import { useState } from "react";

const ProductAddNewOneView = () => {
  const { t } = useTranslation("common");
  const { mutate: deleteProduct, isLoading: loading } =
    useDeleteProductMutation();
  const { data } = useModalState();
  const [activeStep, setActiveStep] = useState<number>(1);
  const { closeModal } = useModalAction();

  const MAX_STEP_COUNT = 7;

  function onNextStep(maxStep: number) {
    if (activeStep + 1 > maxStep) return;
    setActiveStep((prev) => prev + 1);
  }

  function onPrevStep() {
    if (activeStep - 1 < 1) return;
    setActiveStep((prev) => prev - 1);
  }

  return (
    <div className="p-4 pb-6 bg-light m-auto w-[90vw] rounded-md md:rounded-xl ">
      {/* <div className="p-4 pb-6 bg-light m-auto *max-w-lg w-96 rounded-md md:rounded-xl sm:w-96 "> */}
      <div className="w-full h-full text-center">
        <StepsBar current={activeStep} max={MAX_STEP_COUNT} />
        <div className="flex h-full flex-col justify-between">
          {/* <TrashIcon className="mt-4 w-12 h-12 m-auto text-accent" /> */}
          {/*  */}
          <div className="flex items-center justify-between space-s-4 w-full mt-4">
            <div style={{ backgroundColor: "green" }}>
              <Button
                size="small"
                onClick={() => onPrevStep()}
                disabled={activeStep === 1}
              >
                <ArrowPrev />
              </Button>
            </div>
            <div
              style={{
                // backgroundColor: "tomato",
                height: "500px",
                overflowY: "auto",
              }}
              className="w-10/12"
            >
              <CreateOrUpdateProductFormStepped
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                onCloseModal={closeModal}
              />
            </div>
            <div style={{ backgroundColor: "green" }}>
              <Button
                size="small"
                onClick={() => onNextStep(MAX_STEP_COUNT)}
                disabled={activeStep === MAX_STEP_COUNT}
              >
                <ArrowNext />
              </Button>
            </div>
          </div>

          {/*  <p className="text-heading text-xl font-bold mt-4">
            {t("Add new One")}
          </p>
          <p className="text-body-dark dark:text-muted leading-relaxed py-2 px-6">
            {t("add new product")}
          </p> */}
          <div className="flex items-center justify-between space-s-4 w-full mt-8">
            <div className="w-11/12"></div>

            <div className="w-1/12">
              <Button
                onClick={closeModal}
                /*    onClick={onDelete}
                loading={deleteBtnLoading}
                disabled={deleteBtnLoading} */
                variant="custom"
                className={cn(
                  "w-full py-2 px-4 bg-red-600 focus:outline-none hover:bg-red-700 focus:bg-red-700 text-light transition ease-in duration-200 text-center text-base font-semibold rounded shadow-md",
                  // deleteBtnClassName,
                )}
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAddNewOneView;
