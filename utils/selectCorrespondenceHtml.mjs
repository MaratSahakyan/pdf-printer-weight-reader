import {
  SHIPMENT_TAG_ACCEPT_CARGO,
  SHIPMENT_TAG_AFTER_WEIGHT,
} from "../constantes/index.mjs";
import shipmentTagAcceptCargo from "../views/shipmentTagAcceptCargo.mjs";
import shipmentTagAfterWeight from "../views/shipmentTagAfterWeight.mjs";

const selectCorrespondenceHtml = async (data) => {
  switch (data?.printCheckName) {
    case SHIPMENT_TAG_AFTER_WEIGHT:
      return await shipmentTagAfterWeight(data);
    case SHIPMENT_TAG_ACCEPT_CARGO:
      return await shipmentTagAcceptCargo(data);
    default:
      return "";
  }
};

export default selectCorrespondenceHtml;
