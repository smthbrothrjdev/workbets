import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const AUTH_STORAGE_KEY = "workbets.authUserId";
const ASCII_REGEX = /^[\x20-\x7E]+$/;
const DIGIT_REGEX = /[0-9]/;
const LETTER_REGEX = /[A-Za-z]/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*()]/;
const ASCII_SYMBOL_REGEX = /[\\[\]{};:'",.<>/?`~|\\\-_=+]/;

const sanitizeInput = (value) =>
  String(value ?? "")
    .split("")
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join("");
const sanitizeEmail = (value) =>
  sanitizeInput(value).replace(/\s+/g, "").toLowerCase();

const getPasswordValidation = (value) => {
  const sanitizedValue = sanitizeInput(value);

  if (sanitizedValue.length < 5 || sanitizedValue.length > 24) {
    return {
      isValid: false,
      sanitizedValue,
      message: "Password must be 5-24 characters long.",
    };
  }

  if (!ASCII_REGEX.test(sanitizedValue)) {
    return {
      isValid: false,
      sanitizedValue,
      message: "Password must use standard ASCII characters only.",
    };
  }

  if (/\s/.test(sanitizedValue)) {
    return {
      isValid: false,
      sanitizedValue,
      message: "Password cannot include spaces.",
    };
  }

  const categories = [
    DIGIT_REGEX.test(sanitizedValue),
    LETTER_REGEX.test(sanitizedValue),
    SPECIAL_CHAR_REGEX.test(sanitizedValue),
    ASCII_SYMBOL_REGEX.test(sanitizedValue),
  ].filter(Boolean).length;

  if (categories < 3) {
    return {
      isValid: false,
      sanitizedValue,
      message:
        "Password must include at least three of: numbers, letters, special characters, or ASCII symbols.",
    };
  }

  return { isValid: true, sanitizedValue, message: null };
};

export function useAuthWorkflow() {
  const authenticate = useMutation(api.auth.authenticate);
  const register = useMutation(api.auth.register);
  const users = useQuery(api.queries.getUsers);
  const workplaces = useQuery(api.queries.getWorkplaces);
  const userList = useMemo(() => users ?? [], [users]);
  const workplaceList = useMemo(() => workplaces ?? [], [workplaces]);
  const [authUserId, setAuthUserId] = useState(() =>
    localStorage.getItem(AUTH_STORAGE_KEY)
  );
  const [username, setUsername] = useState("riley@workbets.io");
  const [password, setPassword] = useState("workbets123");
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerWorkplace, setRegisterWorkplace] = useState("");
  const [registerError, setRegisterError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const isEmailAuthToken = Boolean(authUserId?.includes("@"));
  const profile = useQuery(
    api.queries.getProfile,
    authUserId && !isEmailAuthToken ? { userId: authUserId } : "skip"
  );
  const isProfileLoading = Boolean(authUserId && profile === undefined);
  const isAuthenticated = useMemo(
    () => Boolean(authUserId && profile),
    [authUserId, profile]
  );

  useEffect(() => {
    if (authUserId && profile === null) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setAuthUserId(null);
    }
  }, [authUserId, profile]);

  useEffect(() => {
    if (!authUserId || !isEmailAuthToken || users === undefined) {
      return;
    }

    const matchingUser = userList.find((user) => user.email === authUserId);
    if (!matchingUser) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setAuthUserId(null);
      return;
    }

    localStorage.setItem(AUTH_STORAGE_KEY, matchingUser.id);
    setAuthUserId(matchingUser.id);
  }, [authUserId, isEmailAuthToken, userList, users]);

  useEffect(() => {
    if (registerWorkplace || workplaceList.length === 0) {
      return;
    }

    setRegisterWorkplace(workplaceList[0].id);
  }, [registerWorkplace, workplaceList]);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    try {
      const result = await authenticate({ username, password });
      if (!result?.userId) {
        setAuthError("We couldn't find that account. Check your credentials.");
        return;
      }
      localStorage.setItem(AUTH_STORAGE_KEY, result.userId);
      setAuthUserId(result.userId);
    } catch {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setRegisterError(null);
    setRegisterSuccess(null);
    setIsRegistering(true);

    const sanitizedEmail = sanitizeEmail(registerEmail);
    const sanitizedWorkplace = sanitizeInput(registerWorkplace);
    const workplaceMatch = workplaceList.find(
      (workplace) => workplace.id === sanitizedWorkplace
    );
    const { isValid, sanitizedValue, message } = getPasswordValidation(
      registerPassword
    );

    setRegisterEmail(sanitizedEmail);
    setRegisterPassword(sanitizedValue);
    setRegisterWorkplace(workplaceMatch ? workplaceMatch.id : "");

    if (!sanitizedEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(sanitizedEmail)) {
      setRegisterError("Enter a valid work email to continue.");
      setIsRegistering(false);
      return;
    }

    if (!workplaceMatch && workplaceList.length > 0) {
      setRegisterError("Choose a workplace to continue.");
      setIsRegistering(false);
      return;
    }

    if (!isValid) {
      setRegisterError(message);
      setIsRegistering(false);
      return;
    }

    try {
      await register({
        email: sanitizedEmail,
        password: sanitizedValue,
        workplaceId: workplaceMatch?.id,
      });
      setRegisterSuccess(
        workplaceMatch
          ? `Registration complete! You can now sign in with ${workplaceMatch.name}.`
          : "Registration complete! You can now sign in."
      );
      setRegisterPassword("");
    } catch (error) {
      setRegisterError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthUserId(null);
    setAuthError(null);
  };

  return {
    authUserId,
    userList,
    profile,
    isProfileLoading,
    isAuthenticated,
    username,
    password,
    authError,
    isSubmitting,
    registerEmail,
    registerPassword,
    registerWorkplace,
    registerError,
    registerSuccess,
    isRegistering,
    workplaces: workplaceList,
    handleSignIn,
    handleSignOut,
    handleRegister,
    handleUsernameChange: setUsername,
    handlePasswordChange: setPassword,
    handleRegisterEmailChange: (value) => setRegisterEmail(sanitizeEmail(value)),
    handleRegisterPasswordChange: (value) =>
      setRegisterPassword(sanitizeInput(value)),
    handleRegisterWorkplaceChange: (value) =>
      setRegisterWorkplace(sanitizeInput(value)),
  };
}
