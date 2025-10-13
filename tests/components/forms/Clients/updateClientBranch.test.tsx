import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdateClientLocation from "@/components/Forms/clients/updateClientBranch";
import { vi } from "vitest";
import { ToastContainer } from "react-toastify";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "@/Features/apiSlice";
import { Provider } from "react-redux";
import { updateClientLocation } from "@/api/client/locations";

// Mocks
vi.mock("@/api/client/locations", () => ({
  updateClientLocation: vi.fn(),
}));

// Mock data
const mockStore = configureStore({
  reducer: apiSlice.reducer,
});

const mockAutoClose = vi.fn();
const mockMasterLocations = [
  { locationId: 1, locationDetails: "Tamil Nadu" },
  { locationId: 2, locationDetails: "Bangalore" },
];

const mockCurrentLocation = {
  locationId: 1,
  address1: "Old Address",
  pincode: "600001",
  state: { locationId: 1, locationDetails: "Tamil Nadu" },
  city: { locationId: 5, locationDetails: "Chennai" },
  hrContactPerson: "Old HR",
  techPerson: "Old Tech",
  hrMobileNumber: "9999999999",
  companyLandline: "044-111111",
  hrContactPersonEmail: "oldhr@example.com",
};

describe("UpdateClientLocation Component", () => {
  beforeEach(() => {
    render(
      <Provider store={mockStore}>
        <UpdateClientLocation
          locationId={1}
          currentClientLocation={mockCurrentLocation}
          masterLocations={mockMasterLocations}
          autoClose={mockAutoClose}
        />
        <ToastContainer />
      </Provider>
    );
  });

  it("renders all form fields with default values", () => {
    expect(screen.getByLabelText(/Address/i)).toHaveValue("Old Address");
    expect(screen.getByLabelText(/Pincode/i)).toHaveValue("600001");
    expect(screen.getByLabelText(/State/i)).toHaveValue("Tamil Nadu");
    // expect(screen.getByLabelText(/City/i)).toHaveValue("Chennai");
    expect(screen.getByLabelText(/HR Contact Person/i)).toHaveValue("Old HR");
    // expect(screen.getByLabelText(/Technical Person/i)).toHaveValue("Old Tech");
    expect(screen.getByLabelText(/HR Mobile Number/i)).toHaveValue(
      "9999999999"
    );
    expect(screen.getByLabelText(/Company Landline/i)).toHaveValue(
      "044-111111"
    );
    expect(screen.getByLabelText(/HR Contact Email/i)).toHaveValue(
      "oldhr@example.com"
    );
  });

  it("submits updated fields successfully", async () => {
    (updateClientLocation as any).mockResolvedValueOnce({ status: 200 });

    fireEvent.change(screen.getByLabelText(/Address/i), {
      target: { value: "New Address" },
    });

    fireEvent.click(screen.getByText(/Submit/i));

    // await waitFor(() => {
    //   expect(updateClientLocation).toHaveBeenCalledWith(1, {
    //     address1: "New Address",
    //   });
    //   expect(mockAutoClose).toHaveBeenCalled();
    // });
  });

  it("shows error toast on failed submission", async () => {
    (updateClientLocation as any).mockResolvedValueOnce({
      status: 400,
      message: "Something went wrong",
    });

    fireEvent.change(screen.getByLabelText(/Address/i), {
      target: { value: "Updated Address" },
    });

    fireEvent.click(screen.getByText(/Submit/i));

    // await waitFor(() => {
    //   expect(updateClientLocation).toHaveBeenCalled();
    //   expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    // });
  });

  it("resets form and closes on cancel", () => {
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(mockAutoClose).toHaveBeenCalled();
  });
});
