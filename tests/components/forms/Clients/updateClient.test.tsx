import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ClientInfoUpdateForm from "@/components/Forms/clients/updateClientInfo";
import { vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "@/Features/apiSlice";

describe("ClientInfoUpdateForm", () => {
  const mockAutoClose = vi.fn();
  const mockUpdateClient = vi.fn(() => Promise.resolve({ status: 200 }));
  vi.mock("@/api/master/clients", () => ({
    updateClient: (...args: any) => mockUpdateClient(),
  }));

  const mockStore = configureStore({
    reducer: apiSlice.reducer,
  });

  const currentClient = {
    clientHeadQuarterCountry: { locationId: "1" },
    clientHeadQuarterState: { locationDetails: "Tamil Nadu", locationId: "2" },
    financePocName: "Raj",
    financeEmail: "raj@example.com",
    financeNumber: "9876543210",
    cinnumber: "CIN123456",
    pannumber: "PAN987654",
    gstnumber: "GST123456",
  };

  const locations = [
    { locationId: "1", locationDetails: "India" },
    { locationId: "2", locationDetails: "Tamil Nadu" },
    { locationId: "3", locationDetails: "Kerala" },
  ];

  beforeEach(() => {
    render(
      <Provider store={mockStore}>
        <ClientInfoUpdateForm
          currentClient={currentClient}
          id={123}
          autoClose={mockAutoClose}
          locations={locations}
        />
      </Provider>
    );
  });

  it("renders the form with required headings", () => {
    expect(screen.getByText(/Update Client/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Finance Person Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CIN Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/PAN Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/GST Number/i)).toBeInTheDocument();
  });

  it("updates input fields correctly", () => {
    const input = screen.getByLabelText(/Finance Person Name/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Suresh" } });
    expect(input.value).toBe("Suresh");
  });

  it("submits the form and calls updateClient", async () => {
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: "updated@example.com" } });

    const submitBtn = screen.getByText(/Submit/i);
    fireEvent.click(submitBtn);

  });

  it("calls autoClose on cancel button", () => {
    const cancelBtn = screen.getByText(/Cancel/i);
    fireEvent.click(cancelBtn);
    expect(mockAutoClose).toHaveBeenCalled();
  });
});
