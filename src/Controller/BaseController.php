<?php
//   A changer
//   namespace App\Controller\admin;
namespace App\Controller;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
// use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

abstract class BaseController extends AbstractController
{
    // protected ContainerInterface $container;
    protected ParameterBagInterface $parameter;
    protected SerializerInterface $serializer;
    public EntityManagerInterface $entityManager;
    protected UserPasswordHasherInterface $passwordHasher;

    public function __construct(
        SerializerInterface $serializer,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
        // ContainerInterface $container,
        ParameterBagInterface $parameter
    ) {
        $this->serializer = $serializer;
        // $this->container = $container;
        $this->parameter = $parameter;
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }

    public function getRepository(string $entity): EntityRepository
    {
        return $this->entityManager->getRepository($entity);
    }

    // public function getService(string $id): mixed
    // {
    //     return $this->container->get($id);
    // }

    public function save(object $object): object
    {
        try {
            if ($object->getId() === null) {
                $this->entityManager->persist($object);
            }
            $this->entityManager->flush();

            return $object;
        } catch (\Exception $ex) {
            throw new \Exception('An error occurred while saving the object', 0, $ex);
        }
    }

    public function persist(object $object): void
    {
        $this->entityManager->persist($object);
    }

    public function flush(): void
    {
        $this->entityManager->flush();
    }

    public function serialize(mixed $data, string $type, array $context = []): string
    {
        return $this->serializer->serialize($data, $type, $context);
    }

    public function jsonResponseNotFound(string $message): JsonResponse
    {
        return new JsonResponse([
            "data" => [],
            "code" => Response::HTTP_NOT_FOUND,
            "success" => false,
            "message" => $message,
        ]);
    }

    public function remove(object $object): bool
    {
        try {
            $this->entityManager->remove($object);
            $this->entityManager->flush();

            return true;
        } catch (\Exception $ex) {
            throw new \Exception('An error occurred while removing the object', 0, $ex);
        }
    }

    public function flashRedirect(string $type, string $message, string $route): Response
    {
        $this->addFlash($type, $message);
        return $this->redirectToRoute($route);
    }

    public function redirectRoute(string $route): Response
    {
        return $this->redirectToRoute($route);
    }

    public function getUrlServer(): string
    {
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
        return $protocol . '://' . $_SERVER['HTTP_HOST'];
    }

    public function uploadFile($file, string $parameter, string $path): array
    {
        $datas = [];
        if ($file !== null) {
            $filename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $datas['filename'] = $filename . '' . uniqid() . '.' . $file->guessExtension();
            $datas['path'] = $this->getUrlServer() . $path . '/' . $datas['filename'];

            $file->move($this->getParameter($parameter), $datas['filename']);
        }

        return $datas;
    }

    public function removeFile(string $filename, string $parameter): void
    {
        $filesystem = new Filesystem();
        $filepath = $this->getParameter($parameter) . '/' . $filename;
        $filesystem->remove($filepath);
    }
}
