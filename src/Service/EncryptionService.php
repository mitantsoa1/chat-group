<?php

// src/Service/EncryptionService.php
namespace App\Service;

use RuntimeException;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class EncryptionService
{
    private string $key;

    public function __construct(string $encryptionKey)
    {
        if (!extension_loaded('sodium')) {
            throw new RuntimeException("Sodium extension is not installed");
        }

        // Nettoyage approfondi
        $cleanKey = preg_replace('/[^0-9a-f]/i', '', $encryptionKey);
        $cleanKey = substr($cleanKey, 0, 64); // Force la longueur

        if (strlen($cleanKey) !== 64 || !ctype_xdigit($cleanKey)) {
            throw new \InvalidArgumentException(sprintf(
                "Clé invalide : Doit être 64 caractères hexadécimaux. Reçu : %d caractères ('%s...')",
                strlen($encryptionKey),
                substr($encryptionKey, 0, 10)
            ));
        }

        $this->key = sodium_hex2bin($cleanKey);
    }

    public function encrypt(string $message): string
    {
        $nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
        $ciphertext = sodium_crypto_secretbox($message, $nonce, $this->key);

        return base64_encode($nonce . $ciphertext);
    }

    public function decrypt(string $encrypted): ?string
    {
        $decoded = base64_decode($encrypted, true);
        if ($decoded === false) {
            return "décodage échoué";
        }

        if (strlen($decoded) < SODIUM_CRYPTO_SECRETBOX_NONCEBYTES + SODIUM_CRYPTO_SECRETBOX_MACBYTES) {
            return "trop court";
        }

        $nonce = substr($decoded, 0, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
        $ciphertext = substr($decoded, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);

        return sodium_crypto_secretbox_open($ciphertext, $nonce, $this->key) ?: "déchiffrement échoué";
    }
}
