import * as React from "react";
import IconButton from "@mui/material/IconButton";
import loadingLoopIcon from "./assets/line-md--loading-alt-loop.svg";

export interface IconifyIconProps {
  baseUrl: string | URL;
  icon: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const IconifyIcon = (props: IconifyIconProps) => {
  const [loading, setLoading] = React.useState<boolean>(true);

  const url = React.useMemo(() => {
    const iconSplitted = props.icon.split(":");
    const url = new URL(
      `/${iconSplitted[0]}/${iconSplitted[1]}.svg?height=24`,
      props.baseUrl,
    );
    return url.toString();
  }, [props.icon, props.baseUrl]);

  const handleLoadIcon = () => setLoading(false);

  return (
    <React.Fragment>
      {loading && (
        <IconButton disabled size="small">
          <img src={loadingLoopIcon} />
        </IconButton>
      )}
      <IconButton onClick={props.onClick} size="small">
        <img
          onLoad={handleLoadIcon}
          src={url}
          style={loading ? {display: "none"} : undefined}
        />
      </IconButton>
    </React.Fragment>
  );
};

export default IconifyIcon;
