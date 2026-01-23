export function LogoMark(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 704 256" {...props}>
      <path
        fill="currentColor"
        d="M0 0h192v128h-64v128H0v-64h64V64H0Zm256 0h192v64H320v64h96v64h-32v64H256Zm256 0h64v192h-64Zm128 0h64v192h-64Zm-64 192h64v64h-64Z"
      />
    </svg>
  );
}
