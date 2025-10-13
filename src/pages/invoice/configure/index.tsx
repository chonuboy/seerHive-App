import React from "react";
import InvoiceBuilder from "@/components/Invoice/invoice-builder";
import MainLayout from "@/components/Layouts/layout";

const InvoiceConfigure = () => {
  return (
    <MainLayout>
      <InvoiceBuilder></InvoiceBuilder>
    </MainLayout>
  );
};

export default InvoiceConfigure;
