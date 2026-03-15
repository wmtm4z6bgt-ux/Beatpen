const firebaseErrors: { [key: string]: string } = {
    'auth/email-already-in-use': 'Этот email уже используется.',
    'auth/invalid-email': 'Некорректный email.',
    'auth/weak-password': 'Пароль должен содержать не менее 6 символов.',
    'auth/user-not-found': 'Пользователь с таким email не найден.',
    'auth/wrong-password': 'Неверный пароль.',
    'auth/invalid-credential': 'Неверные учетные данные.',
};

export const getFirebaseError = (errorCode: string): string => {
    return firebaseErrors[errorCode] || 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте снова.';
};
