import {
  SHIPMANT_TAG_SMALL_STICK,
  SHIPMENT_TAG_ACCEPT_CARGO,
  SHIPMENT_TAG_AFTER_WEIGHT,
} from "../constantes/index.mjs";
// import shipmantTagSmallStick from "../views/shipmantTagSmallStick.mjs";
import newShipmantTagSmallStick from "../views/newShipmantTagSmallStick.mjs";
import shipmentTagAcceptCargo from "../views/shipmentTagAcceptCargo.mjs";
import shipmentTagAfterWeight from "../views/shipmentTagAfterWeight.mjs";

const selectCorrespondenceHtml = async (data) => {
  switch (data?.printCheckName) {
    case SHIPMENT_TAG_AFTER_WEIGHT:
      return await shipmentTagAfterWeight(data);
    case SHIPMENT_TAG_ACCEPT_CARGO:
      return await shipmentTagAcceptCargo(data);
    // case SHIPMANT_TAG_SMALL_STICK:
    //   return await shipmantTagSmallStick(data);
    case SHIPMANT_TAG_SMALL_STICK:
      return await newShipmantTagSmallStick(data);
    default:
      return "";
  }
};

export default selectCorrespondenceHtml;
