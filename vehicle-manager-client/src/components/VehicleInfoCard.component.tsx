import { Divider, Typography, Tooltip } from "antd";
import {
  EditTwoTone,
  DeleteTwoTone,
  RightSquareTwoTone,
} from "@ant-design/icons";

interface VehiclePropsInterface {
  company: string;
  year: string;
  model: string;
  isPrimary: boolean;
  _id: string;
  onEdit: (_id: string) => void;
  onDelete: (_id: string) => void;
}

export const Vehicle = ({
  company,
  year,
  model,
  isPrimary,
  _id,
  onEdit,
  onDelete,
}: VehiclePropsInterface) => {
  const { Text } = Typography;
  return (
    <>
      <Divider />
      <div className="card-container">
        <div className="info-container">
          <Tooltip title="Selected Primary Vehicle">
            {isPrimary ? (
              <RightSquareTwoTone
                style={{ fontSize: "25px", alignSelf: "center" }}
              />
            ) : (
              <RightSquareTwoTone style={{ visibility: "hidden" }} />
            )}
          </Tooltip>

          <Text className="item">{company}</Text>

          <Text className="item">{model}</Text>

          <Text className="item">{year}</Text>
        </div>
        <div className="action-container">
          <Tooltip title="Edit Vehicle Details">
            <EditTwoTone
              onClick={() => onEdit(_id)}
              style={{ margin: "0 10px", padding: '0 20px 0 25px', fontSize: "25px"}}
            />
          </Tooltip>

          <Tooltip title="Remove Vehicle">
            <DeleteTwoTone
              style={{ margin: "0 10px", paddingLeft:'10px' ,fontSize: "25px"}}
              onClick={() => onDelete(_id)}
            />
          </Tooltip>
        </div>
      </div>

      <Divider />
    </>
  );
};

export default Vehicle;
