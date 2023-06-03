import { ref, reactive } from "vue";
import { updatepassword, logout } from "~/api/manager";
import { showModal, toast } from "~/composables/util";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export function useRepassword() {
  const store = useStore();
  const router = useRouter();
  // 修改密码
  const formDialogRef = ref(null);
  const formRef = ref(null);
  const form = reactive({
    oldpassword: "",
    password: "",
    repassword: "",
  });
  const rules = {
    oldpassword: [
      {
        required: true,
        message: "旧密码不能为空",
        trigger: "blur",
      },
    ],
    password: [
      {
        required: true,
        min: 5,
        max: 16,
        message: "密码长度须为5~16，需包含字母、数字和符号两种以上",
        trigger: "blur",
      },
    ],
    repassword: [
      {
        required: true,
        min: 5,
        max: 16,
        message: "密码长度须为5~16，需包含字母、数字和符号两种以上",
        trigger: "blur",
      },
    ],
  };

  const onSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) {
        return false;
      }

      formDialogRef.value.showLoading();
      updatepassword(form)
        .then((res) => {
          toast("修改密码成功，请重新登录");
          store.dispatch("logout");
          // 跳转回登录页
          router.push("/login");
        })
        .finally(() => {
          formDialogRef.value.hideLoading();
        });
    });
  };
  const openRepasswordform = () => {
    formDialogRef.value.open();
  };

  return {
    formDialogRef,
    form,
    rules,
    formRef,
    onSubmit,
    openRepasswordform,
  };
}

export function useLogout() {
  const store = useStore();
  const router = useRouter();
  function handleLogout() {
    showModal("是否退出登录?").then((res) => {
      logout().finally(() => {
        store.dispatch("logout");
        //跳转回登录页
        router.push("/login");
        // 提示退出登录成功
        toast("退出登录成功", "success");
      });
    });
  }
  return { handleLogout };
}
