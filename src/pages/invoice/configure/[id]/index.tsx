import React from "react";
import MainLayout from "@/components/Layouts/layout";
import InvoiceTemplateConfigure from "@/components/Elements/utils/invoiceTemplateConfigure";

const index = () => {
  return (
    <>
      <MainLayout>
        <InvoiceTemplateConfigure />
      </MainLayout>
    </>
  );
};

export default index;
