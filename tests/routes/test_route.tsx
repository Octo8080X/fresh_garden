import { LogoutForm } from "../../mod.ts";
import { PageProps, WithCsrf } from "../../deps.ts";

export default function MustLogin(props: PageProps<unknown, WithCsrf>) {
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        MUST LOGIN
        <LogoutForm
          actionPath="/user/logout"
          csrfToken={props.state.csrf.getTokenStr()}
          class="px-2 py-1 border-gray-500 border-2 rounded bg-white hover:bg-gray-200 transition-colors"
        >
          <p>Logout</p>
        </LogoutForm>
      </div>
    </div>
  );
}
