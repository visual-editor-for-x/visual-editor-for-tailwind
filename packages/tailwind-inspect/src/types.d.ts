namespace JSX {
  interface IntrinsicElements {
    ["iconify-icon"]: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      class?: string;
      icon?: string;
    };
  }
}
