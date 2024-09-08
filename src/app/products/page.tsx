import Products from "@/containers/Products";
import { getTrees } from "@/packages/services/product";
import { map } from "lodash";
import React from "react";

const page = async () => {
  return <Products />;
};

export default page;
