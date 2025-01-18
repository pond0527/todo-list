import logger from 'lib/logger';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import userRepository from 'ports/user-repository';
import { passwordCompare, passwordToHash } from 'domain/user/password';

export default NextAuth({
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: 'Credentials',
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {
                    label: 'Username',
                    type: 'text',
                    placeholder: 'jsmith',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                // 提供された認証情報からユーザーを検索するロジックをここに追加します
                if (!credentials) {
                    return null;
                }

                const { username, password } = credentials;
                const dto = await userRepository.fetchBy(username);
                if (!dto) { 
                    return null;
                }

                const isPasswordValid = passwordCompare(password, dto.password);

                // 返されたオブジェクトはすべて、JWT の「user」プロパティに保存されます。
                // null を返すと、ユーザーに詳細を確認するよう促すエラーが表示されます。
                // このコールバックをエラーで拒否することもできます。これにより、ユーザーはクエリ パラメータとしてエラー メッセージを含むエラー ページに送信されます。
                return isPasswordValid ? {
                    id: dto.user_id,
                    name: dto.name,
                    password: dto.password,
                } : null;
            },
        }),
    ],
    session: {
        strategy: 'jwt', // default
        // strategy: "database",
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        // `jwt()`コールバックは`authorize()`の後に実行されます。
        // `user`に追加したプロパティ`role`と`backendToken`を`token`に設定します。
        jwt({ token, trigger, user }) {
            logger.info(`${trigger}: token: ${token}, user: ${user}`);

            if (user) {
                token.role = user.role;
            }
            return token;
        },
        // `session()`コールバックは`jwt()`の後に実行されます。
        // `token`に追加したプロパティ`role`と`backendToken`を`session`に設定します。
        session({ session, token }) {
            session.user.role = token.role;
            return session;
        },
    },
});
