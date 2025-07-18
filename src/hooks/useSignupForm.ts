import { checkEmailNumber, sendEmail, signup } from "@/apis/signup.api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SignupFormState {
  email: string;
  emailNum: string;
  id: string;
  pw: string;
  pwCheck: string;
}

interface SignupFormActions {
  setEmail: (email: string) => void;
  setEmailNum: (emailNum: string) => void;
  setId: (id: string) => void;
  setPw: (pw: string) => void;
  setPwCheck: (pwCheck: string) => void;
  handleSendEmail: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleVerifyEmailNum: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleSignup: (e: React.FormEvent) => void;
  isSendingEmail: boolean;
  isCheckingEmailNumber: boolean;
  isEmailVerified: boolean;
  isSigningUp: boolean;
  // sendEmailError: Error | null;
  // checkEmailNumberError: Error | null;
  // signupError: Error | null;
}

const useSignupForm = (): SignupFormState & SignupFormActions => {
  const router = useRouter();

  // 1. 상태 정의
  const [email, setEmail] = useState<string>("");
  const [emailNum, setEmailNum] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [pwCheck, setPwCheck] = useState<string>("");

  // 2. 뮤테이션 정의
  // 2-1. 이메일 인증번호 전송 뮤테이션
  const {
    mutate: sendEmailMutate,
    isPending: isSendingEmail,
    // isError: isSendEmailError,
    // error: sendEmailError,
  } = useMutation({
    mutationKey: ["sendEmail", email],
    mutationFn: sendEmail,
    onSuccess: (response) => {
      console.log("✅ 인증번호 전송 성공", response);
      alert("인증번호가 이메일로 전송되었습니다. 확인해주세요.");
      // 성공 시 추가적인 UI 업데이트 (예: 인증번호 입력 필드 활성화 등)
    },
    onError: (err) => {
      console.error("❌ 인증번호 전송 실패", err);
      alert(`인증번호 전송에 실패했습니다: ${err}`);
    },
  });

  // 2-2. 이메일 인증번호 확인 뮤테이션
  const {
    mutate: checkEmailNumberMutate,
    isPending: isCheckingEmailNumber,
    // isError: isCheckEmailNumberError,
    // error: checkEmailNumberError,
    isSuccess: isEmailVerified, // 이메일 인증 성공 여부 상태
  } = useMutation({
    mutationKey: ["checkEmailNumber", emailNum],
    mutationFn: checkEmailNumber,
    onSuccess: (response) => {
      console.log("✅ 인증번호 일치", response);
      alert("이메일 인증이 완료되었습니다!");
      // 성공 시 추가적인 UI 업데이트 (예: 인증 완료 메시지 표시)
    },
    onError: (err) => {
      console.error("❌ 인증번호 불일치", err);
      alert(`이메일 인증번호 확인에 실패했습니다: ${err}`);
    },
  });

  // 2-3. 회원가입 뮤테이션
  const {
    mutate: signupMutate,
    isPending: isSigningUp,
    // isError: isSignupError,
    // error: signupError,
  } = useMutation({
    mutationKey: ["signup", id],
    mutationFn: signup,
    onSuccess: (response) => {
      console.log("✅ 회원가입 완료", response);
      alert("회원가입이 성공적으로 완료되었습니다!");
      router.push("/login"); // 회원가입 성공 시 로그인 페이지로 이동
    },
    onError: (err) => {
      console.error("❌ 회원가입 실패", err);
      alert(`회원가입에 실패했습니다: ${err}`);
    },
  });

  // 3. 핸들러 함수 정의
  // 3-1. 이메일 인증 버튼 클릭 핸들러
  const handleSendEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // 폼 제출 방지
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }
    sendEmailMutate(email);
  };

  // 3-2. 인증번호 확인 버튼 클릭 핸들러
  const handleVerifyEmailNum = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // 폼 제출 방지
    if (!email || !emailNum) {
      alert("이메일과 인증번호를 모두 입력해주세요.");
      return;
    }
    checkEmailNumberMutate({ email, emailNum });
  };

  // 3-3. 회원가입 폼 제출 핸들러
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    // 모든 필드 입력 확인
    if (!email || !emailNum || !id || !pw || !pwCheck) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // 비밀번호 일치 확인
    if (pw !== pwCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 이메일 인증이 완료되었는지 확인
    // 실제 서비스에서는 `isEmailVerified` 상태를 활용하여 이메일 인증이 완료된 후에만 회원가입이 가능하도록 제어하는 것이 좋습니다.
    // 현재는 단순히 상태를 통해 확인하고, 필요하다면 백엔드에서 다시 검증할 수 있습니다.
    // if (!isEmailVerified) {
    //   alert("이메일 인증을 먼저 완료해주세요.");
    //   return;
    // }

    signupMutate({ id, pw, email });
  };

  // 4. 컴포넌트에서 사용할 상태와 함수 반환
  return {
    email,
    setEmail,
    emailNum,
    setEmailNum,
    id,
    setId,
    pw,
    setPw,
    pwCheck,
    setPwCheck,
    handleSendEmail,
    handleVerifyEmailNum,
    handleSignup,
    isSendingEmail,
    isCheckingEmailNumber,
    isEmailVerified,
    isSigningUp,
    // sendEmailError,
    // checkEmailNumberError,
    // signupError,
  };
};

export default useSignupForm;
