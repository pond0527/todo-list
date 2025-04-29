import clsx from 'clsx';
import { Layout } from 'components/Layout';
import { MemberForm } from 'components/Member';
import styles from 'components/Member/member.module.scss';
import { getMemberList } from 'lib/clients/memberClient';
import { useToast } from 'lib/toast';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { MemberApiData, MemberFormType } from 'types/todo/type.d';

type MemberFilter = {
    showDeleted: boolean;
};

const MemberList = () => {
    const router = useRouter();
    const [memberList, setMemberList] = useState<MemberApiData[]>([]);
    const [filter, setFilter] = useState<MemberFilter>({ showDeleted: false });

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        (async () => {
            const memberList = await getMemberList();
            setMemberList(memberList);
            console.log('memberList, ', memberList);
        })();
    }, [router.isReady]);

    const [isOpenFormModal, setIsOpenFormModal] = useState(false);
    const { toast } = useToast();

    const useFormMethods = useForm<MemberFormType>();

    const handleClickCreate = useCallback(() => {
        useFormMethods.reset({
            name: '',
            isDeleted: false,
        });

        setIsOpenFormModal(true);
    }, [useFormMethods]);

    const handleBack = useCallback(() => {
        setIsOpenFormModal(false);
    }, []);

    const handleComplete = useCallback(async () => {
        // リストを最新化
        const memberList = await getMemberList();
        setMemberList(memberList);
        setIsOpenFormModal(false);

        toast.success('保存しました。');
    }, [toast]);

    return (
        <Layout
            pageTitle="担当者リスト"
            rightItems={
                <>
                    <button
                        className={clsx('btn btn-primary', styles.btn)}
                        onClick={handleClickCreate}
                    >
                        新規作成
                    </button>
                </>
            }
        >
            <form className="form-inline-block">
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={filter.showDeleted}
                        id="defaultCheck1"
                        onChange={(e) => {
                            setFilter((prev) => ({
                                ...prev,
                                showDeleted: e.target.checked,
                            }));
                        }}
                    />
                    <label className="form-check-label" htmlFor="defaultCheck1">
                        削除済みの担当者を含む
                    </label>
                </div>
            </form>

            <div>
                <div className="fw-bold mb-3">全{memberList.length}件</div>
                <table className={clsx('table table-hover', styles.table)}>
                    <thead className={'table-light'}>
                        <tr>
                            <th>担当者名</th>
                        </tr>
                    </thead>
                    <tbody>
                        {memberList
                            .filter((o) => {
                                // フィルター1
                                if (!filter.showDeleted && o.isDeleted) {
                                    // 削除済み担当者は非表示
                                    return null;
                                } else {
                                    return o;
                                }
                            })
                            .reverse()
                            .map((todo) => {
                                return (
                                    <tr
                                        key={todo.memberId}
                                        className={clsx(
                                            styles.dataRow,
                                            todo.isDeleted && styles.deleted,
                                        )}
                                    >
                                        <td className={'text-wrap'}>
                                            <Link
                                                href={`/member/${todo.memberId}`}
                                            >
                                                {todo.name}
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>

            <ReactModal
                isOpen={isOpenFormModal}
                overlayClassName="overlay"
                ariaHideApp={true}
                onRequestClose={() => {
                    setIsOpenFormModal(false);
                }}
            >
                <FormProvider {...useFormMethods}>
                    <MemberForm
                        mode={'new'}
                        onComplete={handleComplete}
                        onBack={handleBack}
                    />
                </FormProvider>
            </ReactModal>
        </Layout>
    );
};

export default MemberList;
