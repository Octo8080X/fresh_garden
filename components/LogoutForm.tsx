import { JSX } from "preact";

interface LogoutFormProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  csrfToken: string;
  actionPath: string;
}

export function LogoutForm(
  { csrfToken, actionPath, ...other }: LogoutFormProps,
) {
  return (
    <form action={actionPath} method="post">
      <input type="hidden" name="csrf" value={csrfToken} />
      <button
        type="submit"
        {...other}
      />
    </form>
  );
}
