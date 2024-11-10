<?php

namespace App\Repository;

use App\Entity\Groups;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use App\Enum\FriendshipStatusEnum;
use Doctrine\DBAL\Connection;


/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    private $connection;

    public function __construct(ManagerRegistry $registry, Connection $connection)
    {
        parent::__construct($registry, User::class);
        $this->connection = $connection;
    }


    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }


    public function findByroleadmin()
    {
        return $this->createQueryBuilder('u')
            ->orderBy('u.id', 'ASC')
            ->where('u.roles LIKE :role')
            ->setParameter('role', '%"' . 'ROLE_ADMIN' . '"%')
            ->getQuery()
            ->getResult()
        ;
    }

    public function findUsersInGroups()
    {
        return $this->findAll();
    }
    public function findUsersNotInGroups(Groups $groups)
    {
        return $this->createQueryBuilder('u');
    }
}
