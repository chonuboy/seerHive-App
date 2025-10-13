import React from "react";
import TemplateViewer from "@/components/Elements/cards/invoiceTemplateViewer";
import MainLayout from "@/components/Layouts/layout";

const index = () => {
  return (
    <>
      <MainLayout>
        <TemplateViewer />
      </MainLayout>
    </>
  );
};

export default index;
