<?php

declare(strict_types=1);

use App\Domain\Auth\BcryptHasher;
use App\Domain\Auth\Compte;
use App\Domain\Auth\ComptesRepository;
use App\Domain\Auth\EmailDejaUtiliseException;
use App\Domain\Auth\InscriptionService;
use App\Domain\Auth\PasswordPolicy;
use App\Domain\Auth\StatutCompte;
use App\Domain\Auth\VerificationMailer;

final class MemoireComptes implements ComptesRepository
{
    /** @var Compte[] */
    public array $comptes = [];
    public bool $courseSurCreation = false;

    public function emailExiste(string $email): bool
    {
        foreach ($this->comptes as $c) {
            if ($c->email === $email) {
                return true;
            }
        }
        return false;
    }

    public function creer(Compte $compte): void
    {
        if ($this->courseSurCreation || $this->emailExiste($compte->email)) {
            throw new EmailDejaUtiliseException();
        }
        $this->comptes[] = $compte;
    }
}

final class MailerEspion implements VerificationMailer
{
    public array $envois = [];
    public bool $echoue = false;

    public function envoyerVerification(string $email, string $nom): void
    {
        if ($this->echoue) {
            throw new RuntimeException('SMTP indisponible');
        }
        $this->envois[] = $email;
    }
}

function service(MemoireComptes $repo, MailerEspion $mail, ?Closure $log = null): InscriptionService
{
    return new InscriptionService($repo, new BcryptHasher(), $mail, null, $log);
}

const MDP_OK = 'Abcdefg1';

test('compte créé avec statut en_attente_verification et rôle client', function () {
    $repo = new MemoireComptes();
    $r = service($repo, new MailerEspion())->inscrire('Ana', 'ana@example.com', MDP_OK, MDP_OK);
    assertTrue($r->reussie);
    assertSame(1, count($repo->comptes));
    assertSame(StatutCompte::EN_ATTENTE_VERIFICATION, $repo->comptes[0]->statut);
    assertSame('client', $repo->comptes[0]->role);
});

test('email normalisé (minuscules, espaces retirés)', function () {
    $repo = new MemoireComptes();
    service($repo, new MailerEspion())->inscrire('Ana', '  Ana@Example.COM ', MDP_OK, MDP_OK);
    assertSame('ana@example.com', $repo->comptes[0]->email);
});

test('mot de passe haché en bcrypt, jamais en clair', function () {
    $repo = new MemoireComptes();
    service($repo, new MailerEspion())->inscrire('Ana', 'ana@example.com', MDP_OK, MDP_OK);
    $hash = $repo->comptes[0]->motDePasseHache;
    assertTrue($hash !== MDP_OK);
    assertTrue(str_starts_with($hash, '$2y$'));
    assertTrue(password_verify(MDP_OK, $hash));
});

test('email déjà utilisé : erreur explicite sur le champ email, aucun second compte', function () {
    $repo = new MemoireComptes();
    $mail = new MailerEspion();
    $s = service($repo, $mail);
    $s->inscrire('Ana', 'ana@example.com', MDP_OK, MDP_OK);
    $r = $s->inscrire('Bis', 'ANA@example.com', MDP_OK, MDP_OK);
    assertTrue(!$r->reussie);
    assertSame('Un compte existe déjà avec cette adresse email.', $r->erreurs['email'][0]);
    assertSame(1, count($repo->comptes));
    assertSame(1, count($mail->envois));
});

test('course sur la contrainte UNIQUE : erreur propre, pas d’exception', function () {
    $repo = new MemoireComptes();
    $repo->courseSurCreation = true;
    $r = service($repo, new MailerEspion())->inscrire('Ana', 'ana@example.com', MDP_OK, MDP_OK);
    assertTrue(!$r->reussie);
    assertTrue(isset($r->erreurs['email']));
});

test('mot de passe trop faible : une erreur explicite par règle', function () {
    $repo = new MemoireComptes();
    $r = service($repo, new MailerEspion())->inscrire('Ana', 'ana@example.com', 'abc', 'abc');
    assertTrue(!$r->reussie);
    assertSame(3, count($r->erreurs['password'])); // longueur, majuscule, chiffre
    assertSame(0, count($repo->comptes));
});

test('politique de mot de passe', function () {
    $p = new PasswordPolicy();
    assertSame([], $p->erreurs('Abcdefg1'));
    assertSame(1, count($p->erreurs('abcdefg1')));
    assertSame(1, count($p->erreurs('ABCDEFG1')));
    assertSame(1, count($p->erreurs('Abcdefgh')));
    assertSame(1, count($p->erreurs('Abcde1')));
});

test('confirmation différente et email invalide rejetés', function () {
    $r = service(new MemoireComptes(), new MailerEspion())->inscrire('Ana', 'pas-un-email', MDP_OK, 'Autre123');
    assertTrue(isset($r->erreurs['email']));
    assertTrue(isset($r->erreurs['password_confirmation']));
});

test('nom vide rejeté', function () {
    $r = service(new MemoireComptes(), new MailerEspion())->inscrire('  ', 'ana@example.com', MDP_OK, MDP_OK);
    assertTrue(isset($r->erreurs['name']));
});

test('email de vérification envoyé automatiquement à l’inscription', function () {
    $mail = new MailerEspion();
    $r = service(new MemoireComptes(), $mail)->inscrire('Ana', 'ana@example.com', MDP_OK, MDP_OK);
    assertSame(['ana@example.com'], $mail->envois);
    assertTrue($r->emailEnvoye);
});

test('envoi en échec : compte conservé, échec journalisé', function () {
    $repo = new MemoireComptes();
    $mail = new MailerEspion();
    $mail->echoue = true;
    $logs = [];
    $r = service($repo, $mail, function (Throwable $e) use (&$logs) {
        $logs[] = $e->getMessage();
    })->inscrire('Ana', 'ana@example.com', MDP_OK, MDP_OK);
    assertTrue($r->reussie);
    assertTrue(!$r->emailEnvoye);
    assertSame(1, count($repo->comptes));
    assertSame(['SMTP indisponible'], $logs);
});
