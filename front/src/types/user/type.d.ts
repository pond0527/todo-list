export type UserFormType = Pick<
    UserListJsonData,
    'userId' | 'name' | 'password' // 複合化状態(画面入力値)
>;

export type UserListJsonData = {
    userId: string;
    name: string;
    password: TodoStatusType; // 暗号化状態
    createAt: Date;
    updateAt: Date;
};
