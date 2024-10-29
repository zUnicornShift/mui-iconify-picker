import React, {
  useState,
  useMemo,
  forwardRef,
  Fragment,
  MouseEvent,
  ChangeEvent,
  ForwardedRef,
  ComponentType,
} from "react";
import questionMarkIcon from "./assets/question_mark_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg";
import arrowDropIcon from "./assets/arrow_drop_down_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg";
import loadingLoopIcon from "./assets/line-md--loading-alt-loop.svg";
import warningIcon from "./assets/mdi--warning-outline.svg";
import OutlinedInput, {OutlinedInputProps} from "@mui/material/OutlinedInput";
import FilledInput, {FilledInputProps} from "@mui/material/FilledInput";
import Input, {InputProps} from "@mui/material/Input";
import Popover, {PopoverProps} from "@mui/material/Popover";
import {InputBaseComponentProps} from "@mui/material/InputBase";
import {PaperProps} from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconifyIcon from "./IconifyIcon";
import InfiniteScroll from "react-infinite-scroll-component";
import {useDebouncedCallback} from "use-debounce";
import {search} from "./IconifyApiClient";

const API_BASE_URL = "https://api.iconify.design";
const DEFAULT_LIMIT = 48;

export interface LoadingComponentProps {
  count?: number;
}

const LoadingComponent = (props: LoadingComponentProps) =>
  Array(props.count || 20)
    .fill(0)
    .map((_, index) => (
      <IconButton disabled key={index} size="small">
        <img src={loadingLoopIcon} />
      </IconButton>
    ));

const ErrorComponent = () => (
  <Box textAlign={"center"}>
    <img src={warningIcon} />
    <Typography variant="body1" color="warning">
      Something went wrong when fetching the icons. Make sure your internet
      connection is working fine.
    </Typography>
  </Box>
);

const initIconsDefault = [
  "mdi:airplane",
  "mdi:block-helper",
  "mdi:calendar-month",
  "mdi:camera-plus",
  "mdi:car-sports",
  "mdi:city",
  "mdi:cloud-arrow-down",
  "mdi:cog",
  "mdi:credit-card",
  "mdi:database",
  "mdi:delete",
  "mdi:dog",
  "mdi:earth",
  "mdi:eiffel-tower",
  "mdi:exit-run",
  "mdi:ferry",
  "mdi:fruit-pear",
  "mdi:gauge",
  "mdi:gas-station-in-use",
  "mdi:golf-cart",
  "mdi:hail",
  "mdi:home",
  "mdi:image-edit",
  "mdi:invoice-multiple",
  "mdi:karate",
  "mdi:leaf-maple",
  "mdi:lightbulb-on",
  "mdi:lock",
  "mdi:map",
  "mdi:map-marker",
  "mdi:meditation",
  "mdi:message-plus",
  "mdi:microphone-plus",
  "mdi:moped",
  "mdi:mower",
  "mdi:muffin",
  "mdi:music-circle",
  "mdi:paw",
  "mdi:penguin",
  "mdi:phone-classic",
  "mdi:phone-in-talk",
  "mdi:pine-tree",
  "mdi:play",
  "mdi:pliers",
  "mdi:puzzle",
  "mdi:radio",
  "mdi:receipt-text",
  "mdi:recycle",
];

const InputInputComponent = forwardRef(
  (props: InputBaseComponentProps, ref: ForwardedRef<HTMLButtonElement>) => {
    const size = props["data-size"] === "small" ? "16" : "24";
    const value = useMemo(() => {
      let value = questionMarkIcon;
      if (props.value) {
        const baseUrl = props["data-api-base-url"];
        const splitted = props.value.split(":");
        const url = new URL(
          `/${splitted[0]}/${splitted[1]}.svg?height=24`,
          baseUrl,
        );
        value = url.toString();
      }
      return value;
    }, [props.value, props["data-api-base-url"]]);

    return (
      <button
        ref={ref}
        {...(props as object)}
        style={{
          ...props?.style,
          alignItems: "center",
          display: "flex",
          cursor: "pointer",
        }}>
        <img width={size + "px"} height={size + "px"} src={value} />
        <img width={size + "px"} height={size + "px"} src={arrowDropIcon} />
      </button>
    );
  },
);

const paperProps: PaperProps = {
  sx: {
    p: 1.5,
  },
};

const sxMap = {
  inputBase: {
    pl: 1,
  },
  scrollableBox: {
    width: "220px",
    maxWidth: "100vw",
  },
};

const variantComponent = {
  standard: Input,
  filled: FilledInput,
  outlined: OutlinedInput,
};

export interface IconifyPickerProps<V, I> {
  inputProps?: Omit<I, "inputComponent">;
  popoverProps?: Omit<
    PopoverProps,
    "open" | "anchorEl" | "onClose" | "children"
  >;
  value?: string | null;
  onChange?: (value: string | null, e: MouseEvent<HTMLElement>) => void;
  placeholderText?: string;
  slots?: {
    loading?: ComponentType<LoadingComponentProps>;
    error?: ComponentType;
  };
  apiBaseUrl?: string | URL;
  initIcons?: string[];
  prefixes?: string;
  prefix?: string;
  category?: string;
  limit?: number;
  variant?: V;
}

const IconifyPicker = (
  props?:
    | IconifyPickerProps<"standard", InputProps>
    | IconifyPickerProps<"filled", FilledInputProps>
    | IconifyPickerProps<"outlined", OutlinedInputProps>,
) => {
  const outlinedInputSx = props?.inputProps?.sx;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const [resultHasMore, setResultHasMore] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [internalValue, setInternalValue] = useState<string | null>(null);

  const Loading = props?.slots?.loading || LoadingComponent;
  const Error = props?.slots?.error || ErrorComponent;
  const size = props?.inputProps?.size || "medium";
  const apiBaseUrl = props?.apiBaseUrl || API_BASE_URL;
  const initIcons = props?.initIcons || initIconsDefault;
  const limit = props?.limit || DEFAULT_LIMIT;

  const InputComponent = variantComponent[props?.variant || "standard"];

  const value =
    typeof props?.value === "undefined" ? internalValue : props?.value;

  const debouncedSearch = useDebouncedCallback(
    // function
    (value: string) => {
      if (value.trim().length) {
        setLoading(true);
        search(
          apiBaseUrl,
          value,
          limit,
          results.length,
          props?.prefixes,
          props?.category,
          props?.prefix,
        )
          .then(data => {
            setLoading(false);
            setResults(data.icons);
            setResultHasMore(
              data.total === data.icons.length && data.total === limit,
            );
          })
          .catch(() => {
            setError(true);
            setLoading(false);
          });
      }
    },
    // delay in ms
    1000,
  );

  const handleClickPickerButton = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setKeyword("");
    setResults([]);
    setLoading(false);
    setError(false);
    setResultHasMore(false);
  };

  const handleNextInfiniteScroll = () => {
    search(
      apiBaseUrl,
      keyword,
      limit + results.length,
      results.length,
      props?.prefixes,
      props?.category,
      props?.prefix,
    )
      .then(data => {
        setResults(results.concat(data.icons));
        setResultHasMore(data.total === data.icons.length);
      })
      .catch(() => {
        setResultHasMore(false);
      });
  };

  const handleChangeSearchPhrase = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    setResults([]);
    setResultHasMore(false);
    setError(false);
    setLoading(true);
    debouncedSearch(value);
  };

  const handleClickIconButton =
    (iconName: string) => (e: MouseEvent<HTMLElement>) => {
      if (props?.onChange) {
        props.onChange(iconName, e);
      }
      setInternalValue(iconName);

      setAnchorEl(null);
      setKeyword("");
      setResults([]);
      setLoading(false);
      setError(false);
      setResultHasMore(false);
    };

  return (
    <Fragment>
      <InputComponent
        {...props?.inputProps}
        sx={outlinedInputSx}
        inputProps={{
          onClick: handleClickPickerButton,
          "data-size": size,
          "data-api-base-url": apiBaseUrl.toString(),
          value,
        }}
        inputComponent={InputInputComponent}
      />
      <Popover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        {...props?.popoverProps}
        open={!!anchorEl}
        anchorEl={anchorEl}
        PaperProps={{...paperProps, ...props?.popoverProps?.PaperProps}}
        onClose={handleClosePopover}>
        <Box sx={sxMap.scrollableBox}>
          <InfiniteScroll
            dataLength={
              keyword.trim().length === 0 ? initIcons.length : results.length
            }
            hasMore={resultHasMore}
            height={"200px"}
            next={handleNextInfiniteScroll}
            loader={<Loading count={limit} />}>
            <InputBase
              size="small"
              fullWidth
              value={keyword}
              onChange={handleChangeSearchPhrase}
              sx={sxMap.inputBase}
              placeholder={
                props?.placeholderText || "Type anything to search..."
              }
            />
            <Divider />
            {error && <Error />}
            {keyword.trim().length === 0 &&
              !error &&
              initIcons.map((iconName, index) => (
                <IconifyIcon
                  onClick={handleClickIconButton(iconName)}
                  baseUrl={apiBaseUrl}
                  icon={iconName}
                  key={index}
                />
              ))}
            {keyword.trim().length > 0 &&
              !error &&
              results.length > 0 &&
              results.map((iconName, index) => (
                <IconifyIcon
                  onClick={handleClickIconButton(iconName)}
                  baseUrl={apiBaseUrl}
                  icon={iconName}
                  key={index}
                />
              ))}
            {keyword.trim().length > 0 &&
              loading &&
              !error &&
              results.length === 0 && <Loading count={limit} />}
          </InfiniteScroll>
        </Box>
      </Popover>
    </Fragment>
  );
};

export default IconifyPicker;
