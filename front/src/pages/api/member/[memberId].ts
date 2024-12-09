import { MemberApiData, MemberFormType } from 'types/todo/type.d';
import { ApiResoinse } from 'types/api/type.d';
import { NextApiRequest, NextApiResponse } from 'next';
import { Member } from 'types/mysql/type';
import logger from 'lib/logger';
import memberRepository from 'ports/member-repository';
import { ulid } from 'ulid';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiResoinse<boolean | MemberApiData>>,
) => {
    console.log(req.query, req.body);

    const { memberId } = req.query;

    if (req.method === 'POST') {
        const form = JSON.parse(req.body) as MemberFormType;

        const registData = {
            member_id: ulid(),
            name: form.name,
            is_deleted: form.isDeleted,
        } as Member;

        const isSuccess = await memberRepository.register(registData);
        if (isSuccess) {
            res.status(200).json({
                data: {
                    memberId: registData.member_id,
                    name: registData.name,
                    isDeleted: registData.is_deleted,
                } as MemberApiData,
            });
        } else {
            res.status(200).json({ data: false });
        }
    } else if (req.method === 'PUT') {
        if (memberId == null) {
            logger.warn('required memberId');
            res.status(400);
            return;
        }

        const form = JSON.parse(req.body) as MemberFormType;

        // シングルユーザーしかサポートしてないので競合は考慮しない
        const updateData = {
            member_id: memberId,
            name: form.name,
        } as Member;

        const isSuccess = await memberRepository.update(updateData);
        res.status(200).json({ data: isSuccess });
    } else if (req.method === 'GET') {
        if (memberId == null) {
            logger.warn('required memberId');
            res.status(400);
            return;
        }

        const member: Member | undefined = await memberRepository.fetchBy(
            String(memberId),
        );

        if (member) {
            res.status(200).json({
                data: {
                    memberId: member.member_id,
                    name: member.name,
                } as unknown as MemberApiData,
            });
        } else {
            logger.warn(`not found, memberId=${memberId}`);
            res.status(404);
        }
    } else if (req.method === 'DELETE') {
        if (memberId == null) {
            logger.warn('required memberId');
            res.status(400);
            return;
        }

        const isSuccess = await memberRepository.deleteBy(memberId.toString());
        res.status(200).json({ data: isSuccess });
    } else {
        res.status(403);
    }
};

export default handler;
