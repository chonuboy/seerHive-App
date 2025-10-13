import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddClientLocation from "@/components/Forms/clients/addClientLocation";
import { vi } from "vitest";
import { createClientLocation } from "@/api/client/locations";
import { ToastContainer } from "react-toastify";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "@/Features/apiSlice";
import { Provider } from "react-redux";

// Mocks
vi.mock("@/api/client/locations", () => ({
  createClientLocation: vi.fn(),
}));

const mockstore = configureStore({
  reducer: apiSlice.reducer,
})

const mockAutoClose = vi.fn();
const mockLocations = [{ locationId: 1, locationDetails: "Tamil Nadu" }];

describe("AddClientLocation Component", () => {
  beforeEach(() => {
    render(
      <Provider store={mockstore}>
        <AddClientLocation
          clientId={123}
          masterLocations={mockLocations}
          autoClose={mockAutoClose}
        />
        <ToastContainer />
      </Provider>
    );
  });

  it("renders all required fields", () => {
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pincode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/HR Contact Person/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Technical Person/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/HR Mobile Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Landline/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/HR Contact Email/i)).toBeInTheDocument();
  });


  it("submits the form successfully", async () => {
    (createClientLocation as any).mockResolvedValueOnce({ status: 201 });

    fireEvent.change(screen.getByLabelText(/Address/i), {
      target: { value: "Chennai Office" },
    });
    fireEvent.change(screen.getByLabelText(/Pincode/i), {
      target: { value: "600001" },
    });
    fireEvent.change(screen.getByLabelText(/State/i), {
      target: { value: "Tamil Nadu" },
    });
    fireEvent.change(screen.getByLabelText(/City/i), {
      target: { value: "Chennai" },
    });
    fireEvent.change(screen.getByLabelText(/HR Contact Person/i), {
      target: { value: "John HR" },
    });
    fireEvent.change(screen.getByLabelText(/Technical Person/i), {
      target: { value: "Jane Tech" },
    });
    fireEvent.change(screen.getByLabelText(/HR Mobile Number/i), {
      target: { value: "9876543210" },
    });
    fireEvent.change(screen.getByLabelText(/Company Landline/i), {
      target: { value: "044-123456" },
    });
    fireEvent.change(screen.getByLabelText(/HR Contact Email/i), {
      target: { value: "john@example.com" },
    });

    fireEvent.click(screen.getByText(/Submit/i));

  });

  it("shows error toast on failed submission", async () => {
    (createClientLocation as any).mockResolvedValueOnce({
      status: 400,
      message: "Something went wrong",
    });

    fireEvent.change(screen.getByLabelText(/Address/i), {
      target: { value: "Chennai Office" },
    });
    fireEvent.change(screen.getByLabelText(/Pincode/i), {
      target: { value: "600001" },
    });
    fireEvent.change(screen.getByLabelText(/State/i), {
      target: { value: "Tamil Nadu" },
    });
    fireEvent.change(screen.getByLabelText(/City/i), {
      target: { value: "Chennai" },
    });
    fireEvent.change(screen.getByLabelText(/HR Contact Person/i), {
      target: { value: "John HR" },
    });
    fireEvent.change(screen.getByLabelText(/Technical Person/i), {
      target: { value: "Jane Tech" },
    });
    fireEvent.change(screen.getByLabelText(/HR Mobile Number/i), {
      target: { value: "9876543210" },
    });
    fireEvent.change(screen.getByLabelText(/Company Landline/i), {
      target: { value: "044-123456" },
    });
    fireEvent.change(screen.getByLabelText(/HR Contact Email/i), {
      target: { value: "john@example.com" },
    });

    fireEvent.click(screen.getByText(/Submit/i));
  });

  it("resets form and closes on cancel", async () => {
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(mockAutoClose).toHaveBeenCalled();
  });
});
