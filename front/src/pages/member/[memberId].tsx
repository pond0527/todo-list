import { MemberForm } from 'components/Member';
import { getMember } from 'lib/clients/memberClient';
import { useRouter } from 'next/router';
import { useLayoutEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { MemberFormType } from 'types/todo/type';

const EditMember = () => {
    const router = useRouter();
    const { memberId } = router.query;
    const useFormMethods = useForm<MemberFormType>();

    useLayoutEffect(() => {
        if (!router.isReady || !memberId) {
            return;
        }

        (async () => {
            const member = await getMember(String(memberId));
            useFormMethods.reset({ ...member });
            console.log(memberId, member);
        })();
    }, [router.isReady, memberId, useFormMethods]);

    return (
        <FormProvider {...useFormMethods}>
            <MemberForm
                mode={'edit'}
                onComplete={() => router.push('/member')}
                onBack={() => router.back()}
            />
        </FormProvider>
    );
};

export default EditMember;
