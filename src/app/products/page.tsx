import Products from "@/containers/Products";
import { getAllTree } from "@/packages/services/treesApi";
import { map } from "lodash";
import React from "react";

const page = async () => {
  const { trees } = await getAllTree();
  return <Products trees={trees} />;
};

export default page;
