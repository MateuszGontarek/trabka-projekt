declare module "react-google-recaptcha" {
  import { Component } from "react";

  export interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    onExpired?: () => void;
    onErrored?: (error: unknown) => void;
    theme?: "light" | "dark";
    size?: "compact" | "normal" | "invisible";
    [key: string]: unknown;
  }

  export default class ReCAPTCHA extends Component<ReCAPTCHAProps> {}
}
