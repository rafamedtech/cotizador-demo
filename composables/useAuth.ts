export function useAuth() {
  const { auth } = useSupabaseClient();

  const toast = useToast();

  async function userLogin({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    try {
      const { error } = await auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        toast.add({
          title: "Bienvenido",
          color: "green",
          icon: "i-heroicons-check-circle",
        });
      }

      if (error) throw error;
    } catch (error: any) {
      toast.add({
        title: "El usuario y/o contraseña son incorrectos",
        color: "red",
        icon: "i-heroicons-information-circle",
      });
    }
  }

  async function userLogout() {
    try {
      const { error } = await auth.signOut();

      if (error) throw error;
    } catch (error) {
      console.log(error);
    }

    // try {
    //   await $fetch("/api/_supabase/session", {
    //     method: "POST",
    //     body: { event: "SIGNED_OUT", session: null },
    //   });
    //   user.value = null;
    // } catch (error) {
    //   console.error(error);
    // }

    await navigateTo("/login");
  }

  return { userLogin, userLogout };
}
