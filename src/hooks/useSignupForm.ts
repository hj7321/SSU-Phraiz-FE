import {
  checkEmailNumber,
  checkIdDuplicated,
  sendEmail,
  signup,
} from "@/apis/signup.api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const idRegex = /^[a-zA-Z0-9]+$/; // 영문 또는 숫자
const pwRegex =
  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[a-zA-Z0-9!@#$%^&*()_+]+$/; // 영문, 숫자, 특수문자 포함

const INITIAL_TIMER_SECONDS = 300;

// 회원가입 폼과 관련된 모든 상태(데이터)
interface SignupFormState {
  // 폼 필드의 현재 값들
  email: string;
  emailNum: string;
  id: string;
  pw: string;
  pwCheck: string;

  // 각 필드의 유효성 검사 결과 및 관련 에러 메시지들
  isEmailInvalid: boolean;
  emailErrorMessage: string;

  remainingTime: number;
  isIdInvalid: boolean;
  idErrorMessage: string;

  isPwInvalid: boolean;
  pwErrorMessage: string;

  isPwCheckInvalid: boolean;
  pwCheckErrorMessage: string;
}

// 회원가입 폼과 관련된 모든 액션(함수 및 파생 상태)
interface SignupFormActions {
  // 각 폼 필드의 값을 업데이트하는 Setter 함수들
  setEmail: (email: string) => void;
  setEmailNum: (emailNum: string) => void;
  setId: (id: string) => void;
  setPw: (pw: string) => void;
  setPwCheck: (pwCheck: string) => void;

  // 사용자 이벤트를 처리하는 핸들러 함수들
  handleSendEmail: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  handleVerifyEmailNum: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  handleCheckIdDuplicated: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  handleSignup: (e: React.FormEvent) => void;

  // 파생된 상태 또는 액션의 결과로 변화하는 상태들
  isSendingEmailNum: boolean;
  isEmailNumSendSuccessful: boolean;
  isEmailNumSendFailed: boolean;
  resetSendEmailState: () => void;
  emailInputDisabled: boolean;

  isTimerActive: boolean;
  isCheckingEmailNumber: boolean;
  isEmailVerifySuccessful: boolean;
  isEmailVerifyFailed: boolean;

  isVerifyButtonEnabled: boolean;

  isCheckingIdDuplicated: boolean;
  isIdAvailable: boolean;
  isCheckFailed: boolean;
  resetCheckIdDuplicatedState: () => void;

  isSigningUp: boolean;
}

const useSignupForm = (): SignupFormState & SignupFormActions => {
  const router = useRouter();

  // 1. 상태 정의
  const [email, setEmailState] = useState<string>("");
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");

  const [emailNum, setEmailNumState] = useState<string>("");

  const [id, setIdState] = useState<string>("");
  const [idErrorMessage, setIdErrorMessage] = useState<string>("");

  const [pw, setPwState] = useState<string>("");
  const [pwErrorMessage, setPwErrorMessage] = useState<string>("");

  const [pwCheck, setPwCheckState] = useState<string>("");
  const [pwCheckErrorMessage, setPwCheckErrorMessage] = useState<string>("");

  const [remainingTime, setRemainingTime] = useState<number>(
    INITIAL_TIMER_SECONDS
  );
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 2. 유효성 검사 함수 정의
  // 2-1. 이메일 유효성 검사 함수
  const validateEmail = (value: string): boolean => {
    if (value.length === 0) {
      setEmailErrorMessage("");
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailErrorMessage("이메일 형식이 올바르지 않습니다.");
      return true;
    }
    setEmailErrorMessage("");
    return false;
  };

  // 2-2. 아이디 유효성 검사 함수
  const validateId = (value: string): boolean => {
    if (value.length === 0) {
      setIdErrorMessage("");
      return false;
    }
    if (value.length < 4 || value.length > 15) {
      setIdErrorMessage("아이디는 4자 이상 15자 이하여야 합니다.");
      return true;
    }
    if (!idRegex.test(value)) {
      setIdErrorMessage("아이디는 영문 또는 숫자만 포함해야 합니다.");
      return true;
    }
    setIdErrorMessage("");
    return false;
  };

  // 2-3. 비밀번호 유효성 검사 함수
  const validatePw = (value: string): boolean => {
    if (value.length === 0) {
      setPwErrorMessage("");
      return false;
    }
    if (value.length < 8 || value.length > 20) {
      setPwErrorMessage("비밀번호는 8자 이상 20자 이하여야 합니다.");
      return true;
    }
    if (!pwRegex.test(value)) {
      setPwErrorMessage(
        "비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다."
      );
      return true;
    }
    setPwErrorMessage("");
    return false;
  };

  // 2-4. 비밀번호 확인 유효성 검사 함수
  const validatePwCheck = (value: string, pw: string): boolean => {
    if (value.length === 0) {
      setPwCheckErrorMessage("");
      return false;
    }
    if (value != pw) {
      setPwCheckErrorMessage("비밀번호가 일치하지 않습니다.");
      return true;
    }
    setPwCheckErrorMessage("");
    return false;
  };

  // 3. 뮤테이션 정의
  // 3-1. 이메일 인증번호 전송 뮤테이션
  const {
    mutate: sendEmailMutate,
    isPending: isSendingEmailNum,
    isSuccess: isEmailNumSendSuccessful,
    isError: isEmailNumSendFailed,
    reset: resetSendEmailState,
  } = useMutation({
    mutationKey: ["sendEmail", email],
    mutationFn: sendEmail,
    onSuccess: () => {
      alert("입력하신 이메일로 인증번호가 전송되었습니다.");
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  // 3-2. 이메일 인증번호 확인 뮤테이션
  const {
    mutate: checkEmailNumberMutate,
    isPending: isCheckingEmailNumber,
    isSuccess: isEmailVerifySuccessful,
    isError: isEmailVerifyFailed,
  } = useMutation({
    mutationKey: ["checkEmailNumber", emailNum],
    mutationFn: checkEmailNumber,
    onSuccess: () => {
      alert("이메일 인증이 완료되었습니다.");
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  // 3-3. 아이디 중복 확인 뮤테이션
  const {
    mutate: checkIdDuplicatedMutate,
    isPending: isCheckingIdDuplicated,
    isSuccess: isIdAvailable,
    isError: isCheckFailed,
    reset: resetCheckIdDuplicatedState,
  } = useMutation({
    mutationKey: ["checkIdDuplicated", id],
    mutationFn: checkIdDuplicated,
    onSuccess: () => {
      alert("사용 가능한 아이디입니다.");
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  // 3-4. 회원가입 뮤테이션
  const {
    mutate: signupMutate,
    isPending: isSigningUp,
    // isError: isSignupError,
    // error: signupError,
  } = useMutation({
    mutationKey: ["signup", id],
    mutationFn: signup,
    onSuccess: () => {
      // ✅ GTM 이벤트 푸시
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "signup_complete",
        feature: "auth",
        method: "email",
      });
      alert("회원가입이 성공적으로 완료되었습니다.");
      router.push("/login"); // 회원가입 성공 시 로그인 페이지로 이동
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  // 4. 파생 상태 정의
  const emailInputDisabled = isSendingEmailNum || isEmailNumSendSuccessful;
  // const isEmailSendButtonEnabled =
  const isVerifyButtonEnabled =
    isEmailNumSendSuccessful &&
    !isCheckingEmailNumber &&
    !isEmailVerifySuccessful &&
    emailNum.length > 0;

  // 5. 타이머 관리
  // 5-1. 타이머 정리 유틸 함수
  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setIsTimerActive(false);
  };

  // 5-2. 타이머 만료 시 후처리 유틸 함수
  const resetAfterExpire = useCallback(() => {
    clearTimer();
    setRemainingTime(INITIAL_TIMER_SECONDS);
    setEmailNumState("");
    resetSendEmailState(); // 버튼 재활성화를 위해 성공 상태 초기화
  }, [resetSendEmailState]);

  // 5-3. 인증번호 전송 성공 → 타이머 시작
  useEffect(() => {
    if (!isEmailNumSendSuccessful) return; // 성공 시에만 실행

    // 1) 기존 타이머 제거
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // 2) 타이머 초기화 및 시작
    setRemainingTime(INITIAL_TIMER_SECONDS);
    setIsTimerActive(true);

    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsTimerActive(false);
          alert(
            "인증번호 유효 시간이 만료되었습니다. 인증번호를 다시 요청해주세요."
          );
          resetAfterExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 3) 언마운트 시 interval 정리
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isEmailNumSendSuccessful, resetAfterExpire]);

  // 5-4. 인증 성공 → 타이머 초기화 및 정지
  useEffect(() => {
    if (isEmailVerifySuccessful) {
      clearTimer(); // 타이머 정리
      setRemainingTime(INITIAL_TIMER_SECONDS); // 시간 05:00으로 재설정
    }
  }, [isEmailVerifySuccessful]);

  // 6. 핸들러 함수 정의
  // 6-1. 이메일 입력 값 변경 및 유효성 검사 핸들러
  const handleSetEmail = (value: string) => {
    setEmailState(value);
    validateEmail(value);
    // 이메일 값이 변경되면 sendEmail 뮤테이션의 상태를 초기화
    resetSendEmailState();
    setEmailNumState(""); // 이메일 변경 시 인증번호 초기화
  };

  // 6-2. 이메일 인증번호 입력 값 변경 및 숫자가 아닌 문자 입력 차단 핸들러
  const handleSetEmailNum = (value: string) => {
    const onlyDigits = value.replace(/[^0-9]/g, "");
    setEmailNumState(onlyDigits);
  };

  // 6-3. 아이디 입력 값 변경 및 유효성 검사 핸들러
  const handleSetId = (value: string) => {
    setIdState(value);
    validateId(value);
    // 아이디 값이 변경되면 checkIdDuplicate 뮤테이션의 상태를 초기화
    resetCheckIdDuplicatedState();
  };

  // 6-4. 비밀번호 입력 값 변경 및 유효성 검사 핸들러
  const handleSetPw = (value: string) => {
    setPwState(value);
    validatePw(value);
    validatePwCheck(pwCheck, value); // 비밀번호 변경 시 비밀번호 확인도 다시 검사
  };

  // 6-5. 비밀번호 확인 입력 값 변경 및 유효성 검사 핸들러
  const handleSetPwCheck = (value: string) => {
    setPwCheckState(value);
    validatePwCheck(value, pw);
  };

  // 6-6. 이메일 인증 버튼 클릭 핸들러
  const handleSendEmail = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault(); // ← 안전 호출
    if (validateEmail(email) || !email) return;
    sendEmailMutate(email);
  };

  // 6-7. 인증번호 확인 버튼 클릭 핸들러
  const handleVerifyEmailNum = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    if (!email || !emailNum) {
      alert("이메일과 인증번호를 모두 입력해주세요.");
      return;
    }
    checkEmailNumberMutate({ email, emailNum });
  };

  // 6-8. 아이디 중복 확인 버튼 클릭 핸들러
  const handleCheckIdDuplicated = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    checkIdDuplicatedMutate(id);
  };
  // 6-9. 회원가입 폼 제출 핸들러
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

    signupMutate({ id, pw, email });
  };

  // 7. 컴포넌트에서 사용할 상태와 함수 반환
  return {
    email,
    setEmail: handleSetEmail, // 커스텀 setEmail 사용
    isEmailInvalid: !!emailErrorMessage, // 에러 메시지가 있으면 true
    emailErrorMessage,

    emailNum,
    setEmailNum: handleSetEmailNum,

    id,
    setId: handleSetId, // 커스텀 setId 사용
    isIdInvalid: !!idErrorMessage, // 에러 메시지가 있으면 true
    idErrorMessage,

    pw,
    setPw: handleSetPw, // 커스텀 setPw 사용
    isPwInvalid: !!pwErrorMessage, // 에러 메시지가 있으면 true
    pwErrorMessage,

    pwCheck,
    setPwCheck: handleSetPwCheck, // 커스텀 setPwCheck 사용
    isPwCheckInvalid: !!pwCheckErrorMessage, // 에러 메시지가 있으면 true
    pwCheckErrorMessage,

    handleSendEmail,
    handleVerifyEmailNum,
    handleCheckIdDuplicated,
    handleSignup,

    isSendingEmailNum,
    isEmailNumSendSuccessful,
    isEmailNumSendFailed,
    resetSendEmailState,
    emailInputDisabled,

    remainingTime,
    isTimerActive,
    isCheckingEmailNumber,
    isEmailVerifySuccessful,
    isEmailVerifyFailed,

    isVerifyButtonEnabled,
    isCheckingIdDuplicated,
    isIdAvailable,
    isCheckFailed,
    resetCheckIdDuplicatedState,

    isSigningUp,
  };
};

export default useSignupForm;
