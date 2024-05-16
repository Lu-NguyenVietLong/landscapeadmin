import { getAllTree } from "@/packages/services/treesApi";
import { map } from "lodash";
import React from "react";

const page = async () => {
  const tree = await getAllTree();
  //   console.log("Tree->", tree);

  return (
    <>
      <h1>Cây</h1>
      <div>
        <ul>
          {/* {map(tree.trees, (tree) => (
            <li key={tree._id}>{tree.name}</li>
          ))} */}
        </ul>
      </div>
    </>
  );
};

export default page;
