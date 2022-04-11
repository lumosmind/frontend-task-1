import React from "react";
import { ProgressBar } from "react-toastify/dist/components";

export default function StepsBar({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  return <div>{`step ${current} of ${max}`} </div>;
}
