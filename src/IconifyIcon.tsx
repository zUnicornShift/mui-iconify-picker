import React, {Fragment, MouseEvent, useMemo, useState} from "react";
import IconButton from "@mui/material/IconButton";
import loadingLoopIcon from "./assets/line-md--loading-alt-loop.svg";

export interface IconifyIconProps {
  baseUrl: string | URL;
  icon: string;
  onClick: (e: MouseEvent<HTMLElement>) => void;
}

const IconifyIcon = (props: IconifyIconProps) => {
  const [loading, setLoading] = useState<boolean>(true);

  const url = useMemo(() => {
    const iconSplitted = props.icon.split(":");
    const url = new URL(
      `/${iconSplitted[0]}/${iconSplitted[1]}.svg?height=24`,
      props.baseUrl,
    );
    return url.toString();
  }, [props.icon, props.baseUrl]);

  const handleLoadIcon = () => setLoading(false);

  return (
    <Fragment>
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
    </Fragment>
  );
};

export default IconifyIcon;
