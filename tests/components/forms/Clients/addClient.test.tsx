import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import AddClient from "@/components/Forms/clients/addClient";
import { countryCodes } from "@/api/countryCodes";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { apiSlice } from "@/Features/apiSlice";

describe("AddClient Component", () => {
  const mockFormik = {
    handleSubmit: vi.fn(),
    handleChange: vi.fn(),
    handleBlur: vi.fn(),
    resetForm: vi.fn(),
    setFieldValue: vi.fn(),
    touched: {},
    errors: {},
    values: {
      clientName: "",
      clientHeadQuarterCountry: {},
      clientHeadQuarterState: {},
      financePocName: "",
      financeEmail: "",
      financeNumber: "",
      cinnumber: "",
      pannumber: "",
      gstnumber: "",
    },
  };

  const mockStore = configureStore({
    reducer: apiSlice.reducer, // use actual or dummy reducers
  });

  const mockLocations = [
    { locationId: "1", locationDetails: "India" },
    { locationId: "2", locationDetails: "Tamil Nadu" },
  ];

  const mockAutoClose = vi.fn();

  beforeEach(() => {
    render(
      <Provider store={mockStore}>
        <AddClient
          formik={mockFormik}
          locations={mockLocations}
          autoClose={mockAutoClose}
        />
      </Provider>
    );
  });

  it("renders the form with required headings and fields", () => {
    expect(screen.getByText(/Add New Client/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Client Name/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Country \(Headquarter\)/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Finance Person Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  it("calls formik.handleChange on typing into client name", () => {
    const input = screen.getByLabelText(/Client Name/i);
    fireEvent.change(input, { target: { value: "Test Client" } });
    expect(mockFormik.handleChange).toHaveBeenCalled();
  });

  it("displays GST field for GST-enabled countries", () => {
    if (countryCodes[0].hasGST) {
      expect(screen.getByLabelText(/GST Number/i)).toBeInTheDocument();
    }
  });

  it("clears GST field when country without GST is selected", () => {
    const countrySelect = screen.getByRole("combobox");
    fireEvent.change(countrySelect, { target: { value: "US" } });
    // It should clear gstnumber value
    expect(mockFormik.setFieldValue).toHaveBeenCalledWith("gstnumber", "");
  });

  it("calls autoClose and resets form on Cancel button click", () => {
    const cancelBtn = screen.getByText(/Cancel/i);
    fireEvent.click(cancelBtn);
    expect(mockAutoClose).toHaveBeenCalled();
    expect(mockFormik.resetForm).toHaveBeenCalled();
  });

  it("submits form on Add button click", () => {
    const submitBtn = screen.getByText(/Submit/i);
    fireEvent.click(submitBtn);
    expect(mockFormik.handleSubmit).toHaveBeenCalled();
  });
});
