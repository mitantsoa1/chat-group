<?php

namespace App\Tests;

use App\Service\EncryptionService;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class EncryptionTest extends KernelTestCase
{
    private EncryptionService $encryptionService;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->encryptionService = self::getContainer()->get(EncryptionService::class);
    }

    public function testServiceInitialization(): void
    {
        $this->assertInstanceOf(EncryptionService::class, $this->encryptionService);
    }

    public function testEncryptionDecryptionCycle(): void
    {
        $originalMessage = "Message ultra secret 123! @#";

        // Test de chiffrement
        $encrypted = $this->encryptionService->encrypt($originalMessage);
        $this->assertNotEquals($originalMessage, $encrypted);
        $this->assertNotEmpty($encrypted);

        // Test de déchiffrement
        $decrypted = $this->encryptionService->decrypt($encrypted);
        $this->assertEquals($originalMessage, $decrypted);
    }

    // public function testInvalidDataHandling(): void
    // {
    //     // Test avec des données corrompues
    //     $this->expectException(\RuntimeException::class);
    //     $this->encryptionService->decrypt("données.invalides");
    // }

    public function testKeyConsistency(): void
    {
        // Vérifie que la même clé est utilisée pour les deux opérations
        $message1 = "Test 1";
        $message2 = "Test 2";

        $encrypted1 = $this->encryptionService->encrypt($message1);
        $encrypted2 = $this->encryptionService->encrypt($message2);

        $this->assertEquals($message1, $this->encryptionService->decrypt($encrypted1));
        $this->assertEquals($message2, $this->encryptionService->decrypt($encrypted2));
    }
}
