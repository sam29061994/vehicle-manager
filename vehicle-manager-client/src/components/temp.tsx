import { useState, useEffect, useMemo } from "react";
import AddVehicle from "./AddVehicle.component";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "../util/api";
import Vehicle from "./Vehicle.component";
import { Divider, Typography, message, Button } from "antd";

export interface VehicleInterface {
  _id: string;
  company: string;
  year: string;
  model: string;
  isPrimary: boolean;
  isEditMode: boolean;
}

const Home = () => {
  const [vehicles, setVehicles] = useState<VehicleInterface[]>([]);
  const { setUser, user } = useAuth();
  const navigate = useNavigate();
  const { Title } = Typography;

  const primaryVehicleId = useMemo(
    () => vehicles.find((vehicle) => vehicle.isPrimary === true)?._id,
    [vehicles]
  );

  useEffect(() => {
    let vehicleList: any[] = [];
    const fetchData = async () => {
      try {
        const result = await axios.get("/vehicle", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        vehicleList = result.data.data.vehicles;
      } catch (e) {
        message.error("Failed to load vehicles");
        return;
      }

      const updatedList: VehicleInterface[] = vehicleList.map((vehicle) => ({
        _id: vehicle._id,
        company: vehicle.company,
        isPrimary: vehicle.isPrimary,
        model: vehicle.trim,
        year: vehicle.year,
        isEditMode: false,
      }));
      setVehicles(updatedList);
    };
    fetchData();
  }, []);

  const onLogout = () => {
    setUser("");
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log(user);
    navigate("/login");
  };

  const onEdit = (_id: string) => {
    const updatedList = vehicles.map((vehicle) => {
      if (vehicle._id === _id) {
        return { ...vehicle, isEditMode: true };
      }
      return vehicle;
    });
    setVehicles(updatedList);
  };

  const onCancelEdit = (_id: string) => {
    const updatedList = vehicles.map((vehicle) => {
      if (vehicle._id === _id) {
        return { ...vehicle, isEditMode: false };
      }
      return vehicle;
    });
    setVehicles(updatedList);
  };

  const onDelete = async (_id: string) => {
    if (primaryVehicleId === _id) {
      message.error("You can not remove a primary vehicle");
      return;
    }
    try {
      await axios.delete(`/vehicle/${_id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
    } catch (e) {
      message.error("Failed to delete vehicle");
      return;
    }

    const updatedList = vehicles.filter((vehicle) => vehicle._id !== _id);
    setVehicles(updatedList);
  };

  const onSubmitEdit = async (
    editVehicle: Omit<VehicleInterface, "isEditMode">
  ) => {
    let updatedList: VehicleInterface[] | null = null;
    if (editVehicle.isPrimary && editVehicle._id !== primaryVehicleId) {
      const vehicle = vehicles.find(
        (vehicle) => vehicle._id === primaryVehicleId
      );
      if (vehicle) {
        const payload = {
          company: vehicle.company,
          trim: vehicle.model,
          year: vehicle.year,
          isPrimary: false,
        };
        try {
          await axios.put(
            `/vehicle/${primaryVehicleId}`,
            JSON.stringify(payload),
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );

          updatedList = vehicles.map((vehicle) => {
            if (vehicle.isPrimary) {
              return { ...vehicle, isPrimary: false };
            } else {
              return vehicle;
            }
          });
        } catch (e) {
          message.error("failed to update the vehicle information");
          return;
        }
      }
    }

    const payload = {
      company: editVehicle.company,
      trim: editVehicle.model,
      year: editVehicle.year,
      isPrimary: editVehicle.isPrimary,
    };

    try {
      const result = await axios.put(
        `/vehicle/${editVehicle._id}`,
        JSON.stringify(payload),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(result);

      const updatedVehicle = result.data.data.vehicle;
      console.log(updatedVehicle);

      updatedList =
        updatedList &&
        updatedList?.map((vehicle) => {
          if (vehicle?._id === editVehicle._id) {
            return {
              _id: vehicle._id as string,
              company: updatedVehicle.company as string,
              model: updatedVehicle.trim as string,
              year: updatedVehicle.year as string,
              isPrimary: updatedVehicle.isPrimary as boolean,
              isEditMode: false,
            };
          } else {
            return vehicle;
          }
        });
    } catch (e) {
      message.error("failed to update the vehicle information");
      return;
    }

    setVehicles(updatedList || []);
  };

  const onAdd = async ({
    company,
    year,
    isPrimary = false,
    model,
  }: Omit<VehicleInterface, "isEditMode">) => {
    if (!company || !year || typeof isPrimary === "undefined" || !model) {
      message.warning(
        "Please fill in all the details before adding the vehicle"
      );
      return;
    }
    const payload = {
      company,
      year,
      trim: model,
      isPrimary: vehicles.length === 0 ? true : isPrimary,
    };
    try {
      const result = await axios.post("/vehicle", JSON.stringify(payload), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const {
        data: { vehicle },
      } = result.data;

      const newVehicle: VehicleInterface = {
        _id: vehicle._id,
        company: vehicle.company,
        year: vehicle.year,
        model: vehicle.trim,
        isPrimary: vehicle.isPrimary,
        isEditMode: false,
      };

      const updatedList = vehicles.map((vehicle) => {
        if (newVehicle.isPrimary) {
          return {
            ...vehicle,
            isPrimary: false,
          };
        } else {
          return vehicle;
        }
      });
      setVehicles([...updatedList, newVehicle]);
    } catch (e) {
      message.error("Failed to add a new vehicle");
      return;
    }
  };

  return (
    <div className="homepage">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title style={{ marginTop: "10px", paddingLeft: "10px" }}>
          Vehicle Manager
        </Title>
        <Button
          type="primary"
          style={{ height: "40px", width: "120px" }}
          onClick={onLogout}
        >
          Logout
        </Button>
      </div>

      <Divider />
      <AddVehicle
        editMode={false}
        onSubmit={onAdd}
        addButtonDisabled={vehicles.length >= 3}
      />
      {vehicles.map(({ isEditMode, ...vehicle }) =>
        isEditMode ? (
          <div key={vehicle._id}>
            <Divider />
            <AddVehicle
              editMode={true}
              {...vehicle}
              onSubmit={() => {}}
              onCancelEdit={onCancelEdit}
              onSumbitEdit={onSubmitEdit}
            />
          </div>
        ) : (
          <Vehicle
            key={vehicle._id}
            {...vehicle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )
      )}
    </div>
  );
};
export default Home;
