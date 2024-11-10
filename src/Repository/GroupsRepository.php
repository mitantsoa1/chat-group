<?php

namespace App\Repository;

use App\Entity\Groups;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Groups>
 */
class GroupsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Groups::class);
    }

    public function findIsGroupMember(Groups $group, int $memberId): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = '
            SELECT g.*
            FROM `groups` g
            WHERE (JSON_CONTAINS(g.members, :memberId) = 1) AND g.id = :groupId
        ';

        $stmt = $conn->prepare($sql);
        $result = $stmt->executeQuery([
            'memberId' => json_encode($memberId),
            'groupId' => $group->getId()
        ]);

        return $result->fetchAllAssociative();
    }

    public function findGroupsWitchMember(User $user): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = '
            SELECT g.*
            FROM `groups` g
            WHERE (JSON_CONTAINS(g.members, :memberId) = 1)
        ';

        $stmt = $conn->prepare($sql);
        $result = $stmt->executeQuery([
            'memberId' => json_encode($user->getId())
        ]);

        return $result->fetchAllAssociative();
    }

    public function findUsersNotMembersGroup(Groups $group): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = '
            SELECT u.*
            FROM user u
            WHERE NOT EXISTS (
                SELECT 1
                FROM `groups` g
                WHERE g.id = :groupId
                AND JSON_CONTAINS(g.members, CAST(u.id AS JSON))
            )
        ';

        $stmt = $conn->prepare($sql);
        $result = $stmt->executeQuery([
            'groupId' => $group->getId()
        ]);

        return $result->fetchAllAssociative();
    }

    public function findUsersMembersGroup(Groups $group, $userRepository)
    {
        $users = [];
        $group = $this->findOneBy(["id" => $group]);
        foreach ($group->getMembers() as $member) {
            $user = $userRepository->findOneBy(["id" => $member]);
            array_push($users, $user);
        }
        return $users;
    }
}
