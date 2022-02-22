import { useState } from "react";
import { VehicleInterface } from "./Home.component";
import { DatePicker, Select, Space, Input, Button } from "antd";

import { CloseCircleTwoTone, CheckCircleTwoTone } from "@ant-design/icons";

import carBrands from "../data/brands.json";
import moment from "moment";

interface AddVehicleProps {
  _id?: string;
  editMode: boolean;
  company?: string;
  model?: string;
  year?: string;
  isPrimary?: boolean;
  onSubmit: (vehicle: VehicleInterface) => void;
  onCancelEdit?: (_id: string) => void;
  onSumbitEdit?: (vehicle: Omit<VehicleInterface, "isEditMode">) => void;
  addButtonDisabled?: boolean;
}
const AddVehicle = ({
  _id = "",
  editMode,
  onSubmit,
  company: companyProp,
  model: modelProp,
  year: yearProp,
  isPrimary: primaryProp,
  addButtonDisabled,
  onCancelEdit = () => {},
  onSumbitEdit = () => {},
}: AddVehicleProps) => {
  const [company, setCompany] = useState(companyProp);
  const [model, setModel] = useState(modelProp);
  const [year, setYear] = useState(yearProp);
  const [isPrimary, setIsPrimary] = useState(primaryProp);

  const { Option } = Select;
  return (
    <>
      <Space size="large" style={{ paddingLeft: "50px" }} wrap>
        <Select
          showSearch
          style={{ width: 150 }}
          placeholder="Select Company"
          optionFilterProp="children"
          onChange={(e) => setCompany(e)}
          value={company}
          filterOption={(input, option) =>
            //@ts-ignore
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {carBrands.map(({ name }) => (
            <Option key={name} value={name}>
              {name}
            </Option>
          ))}
        </Select>
        <Input
          placeholder="Enter Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <DatePicker
          picker="year"
          value={year ? moment(year) : undefined}
          disabledDate={(current) =>
            current && current > moment().endOf("year")
          }
          placeholder="Select a year"
          onChange={(_, dateString) => {
            setYear(dateString);
          }}
        />
        <Select
          placeholder="Set as Primary"
          optionFilterProp="children"
          value={isPrimary}
          onChange={(e) => setIsPrimary(e)}
          filterOption={(input, option) =>
            //@ts-ignore
            option.children
              .toString()
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
        >
          <Option value={true}>Yes</Option>
          <Option value={false}>No</Option>
        </Select>
        {!editMode ? (
          <Button
            type="primary"
            size="middle"
            onClick={() => {
              onSubmit({ company, model, year, isPrimary } as VehicleInterface);
              setCompany(undefined);
              setModel(undefined);
              setYear(undefined);
              setIsPrimary(false);
            }}
            disabled={addButtonDisabled}
          >
            Add Vehicle
          </Button>
        ) : (
          <>
            <CloseCircleTwoTone
              style={{ fontSize: "25px", margin: "0 10px" }}
              onClick={() => onCancelEdit(_id)}
            />
            <CheckCircleTwoTone
              style={{ fontSize: "25px", margin: "0 10px" }}
              onClick={() => {
                if (
                  _id &&
                  model &&
                  company &&
                  year &&
                  typeof isPrimary === "boolean"
                ) {
                  onSumbitEdit({ _id, model, company, year, isPrimary });
                }
              }}
            />{" "}
          </>
        )}
      </Space>
    </>
  );
};

export default AddVehicle;
