---
title: Les version oubliées du protocole IP
author: Eban
category: informatics
date: July 5, 2021
description: On connait tous IPv4 et IPv6 qui sont deux protocoles largement répandus, dans cet article nous allons explorer les versions méconnues du protocole Internet.
highlighted: Yes
published: Yes
slug: versions-ip
initialPublisher: I Learned
initialLink: https://blog.ilearned.eu/versions-ip.html
icon: tabler-network
cover: https://uploads1.wikiart.org/images/marcel-duchamp/network-of-stoppages-1914.jpg
coverDescription: Network of stoppages, 1914 - Marcel Duchamp
---


On connait tous IPv4 et IPv6 qui sont deux protocoles largement répandus (bien qu'un des deux ne le soit pas assez ^^), mais on pourrait légitimement se demander s'il existe d'autres version du Protocole Internet, nous ferrons donc dans cet article un petit tour d'horizon des différentes itérations du protocole IP et de leurs spécificités.

## IPv1 2 et 3 − La genèse du protocole Internet

Le premier document décrivant le fonctionnement d'IP est la [RFC 675](https://www.rfc-editor.org/rfc/rfc675.html) publiée en 1974 mais présentée dès 1973 à l'International Network Working Group. Si vous parcourez cette RFC vous remarquerez qu'elle ne fait pas mention du protocole IP, mais de TCP, en effet à l'époque, TCP et IP n'étaient pas séparés et le principe de couches apporté notamment par le modèle TCP/IP, sortit en 1976, n'était pas encore d'actualité. Parler d'IPv1 est donc un abus de langage, le terme adapté serait plutôt TCP version 1.

Ce protocole avait une particularité intéressante, il contenait quatre champs adresse dans son header, contre deux pour IPv6. Un pour le réseau de destination (et d'origine), rappelez vous, nous sommes en 1974 et à cette époque le réseau Internet comme nous le connaissons aujourd'hui n'existe pas, il existe donc différents réseaux concurrent, ce champ dans l'en-tête a pour but de spécifier sur quel réseau le paquet doit transiter. Ainsi, vous pouvez voir ci-dessous les différentes valeurs possibles pour ce champ et donc les principaux réseaux qui cohabitent à cette époque.

```
1010 = ARPANET
1011 = UCL
1100 = CYCLADES
1101 = NPL
1110 = CADC
1111 = EPSS
```

Les troisième et quatrième champs sont destinés à accueillir les `adresses TCP` d'origine et de destination, ces adresses ne sont pas très détaillées dans la RFC, mais on sait qu'elles sont d'une longueur de 16 bits (65 536 adresses différentes), elles correspondent peu ou prou à ce qu'on appelle aujourd'hui "adresses IP".

Cette première version de TCP est vraiment expérimentale, elle n'a pas été déployée à grande échelle comme l'ont été IPv4 et IPv6

Vient ensuite en 1977 la deuxième version de TCP (et donc par extension du protocole internet), cette version, publiée dans l'[IEN 5](https://www.rfc-editor.org/in-notes/ien/ien5.pdf), apporte certaines améliorations dont notamment le passage à un "Network Identifier", ce qui était auparavant appelé réseau de destination/origine, codé sur 8 bits.

![](versions-ip/Capture_dcran_du_2021-07-04_17-41-26.png)

Autre différence, les "host identifier", anciennement appelés `adresses TCP`, sont maintenant codés sur 24 bits, soit un total de 16 777 216 adresses. On peut aussi voir le début de la séparation entre TCP et IP dans ce schéma d'époque avec les parties "TCP Header" et "Internet Header".

![](versions-ip/Capture_dcran_du_2021-07-04_17-47-49.png)

Séparation qui sera [actée](https://datatracker.ietf.org/doc/html/rfc760) dans la version 3 de TCP, publiée en 1978, ce qui représente une avancée majeure dans l'évolution du protocole internet.

# IPv5

IPv5 n'a pas réellement existé, il s'agit en fait du [Stream Protocol](https://datatracker.ietf.org/doc/html/rfc1190), abrégé ST-II, un protocole de couche 3 (comme IP), créé pour faciliter l'envoi de vidéo et d'audio par internet et qui avait dans le champ version la valeur 5. C'était donc une version modifiée d'IPv4 mais qui avait des adresses codées sur 32 bits, comme pour IPv4, qui ne répondait donc pas à la problématique principale posée par IPv4, le manque d'adresses. Ce protocole marque le début de VoIP (Voice over IP) mais il ne sera pas déployé à grande échelle, VoIP sera ensuite simplement déployé sur IPv4.

# IPv7, 8 et 9 − Le futur ? Ou pas...

IPv7 est un protocole appelé `TP/IX` sortit en 1993, les adresses IP sont codées sur 64 bits (contre 128 avec IPv6), on ne détaillera pas plus ce protocole mais si vous souhaitez en savoir plus je vous invite à lire la [RFC](https://datatracker.ietf.org/doc/html/rfc1475) d'IPv7 qui est très compréhensible.

[IPv8](https://datatracker.ietf.org/doc/html/rfc1621) (mon petit préféré ^^) appelé `PIP` et sortit en 1994 son fonctionnement repose en partie sur le système de [DNS](https://ilearned.eu.org/les-bases-du-dns.html), chaque utilisateur du réseau a un `PIP ID`, un identifiant unique codé sur 64 bits, ainsi, peu importe d'où il se connecte sur le réseau, il est possible de l'identifier rien qu'avec son ID. `PIP` a donc été avant tout pensé pour faciliter les échanges entre appareils changeant d'adresse IP. On pourrait par exemple imaginer une connexion SSH utilisant uniquement le `PIP ID` pour s'authentifier et qui, même si un des deux composants de la connexion (le client ou le serveur) change d'adresse IP reste stable. Je parlais plus tôt du DNS, en effet, avec `PIP` le DNS est modifié pour renvoyer à la fois l(es) adresse(s) IP mais aussi le `PIP ID`. Ce système a néanmoins un problème majeur, le `PIP ID` permettrait de pister très facilement les utilisateurs.

IPv9 enfin est un protocole très peu détaillé, il avait été [annoncé](http://www.china.org.cn/english/scitech/100279.htm) en grande pompe par le gouvernement chinois, celui-ci se targuant du fait que cette version d'IP ait été adoptée dans les secteurs militaires et civils, mais depuis cet effet d'annonce aucune spécification technique n'a été publiée, seulement des bruits de couloir comme quoi les adresses seraient codées sur 256 bits et composées uniquement de caractères numériques (et non pas hexadécimaux comme c'est le cas d'IPv6).
