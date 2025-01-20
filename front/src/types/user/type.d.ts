export type UserFormType = Pick<
    UserApiData,
    'userId' | 'name' | 'password' // 複合化状態(画面入力値)
>;

export type UserApiData = {
    userId: string;
    name: string;
    password: string; // 暗号化状態
    createAt: Date;
    updateAt: Date;
};
