import { TodoForm } from 'components/Todo';
import { getMemberList } from 'lib/clients/memberClient';
import { getStatusList } from 'lib/clients/statusClient';
import { getTodo } from 'lib/clients/todoClient';
import { GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { useLayoutEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
    Member,
    Status,
    TodoFormType,
} from 'types/todo/type';

type Props = {
    memberList: Member[];
    statusList: Status[];
};

const EditTodo = ({ memberList, statusList }: Props) => {
    const router = useRouter();
    const { todoId } = router.query;
    const useFormMethods = useForm<TodoFormType>();

    useLayoutEffect(() => {
        if (!router.isReady || !todoId) {
            return;
        }

        (async () => {
            const todo = await getTodo(Number(todoId));
            useFormMethods.reset(todo);
        })();
    }, [router.isReady, todoId, useFormMethods]);


    return (
        <FormProvider {...useFormMethods}>
            <TodoForm
                mode={'edit'}
                memberList={memberList}
                statusList={statusList}
                onComplete={() => router.push('/todo')}
                onBack={() => router.back()}
            />
        </FormProvider>
    );
};

export default EditTodo;

export const getServerSideProps = async (
    context: any,
): Promise<GetServerSidePropsResult<Props>> => {
    const memberList = await getMemberList();
    const statusList = await getStatusList();

    return {
        props: { memberList, statusList },
    };
};
