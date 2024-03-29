.. probtn documentation master file, created by
   sphinx-quickstart on Mon Nov  2 12:32:08 2015.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.
 
.. _description:
 
Общее описание кнопки
==================================

Получение настроек кнопки
----------------------------------
Скрипт кнопки получает настройки несколькими путями (в порядке приоритета настроек):
Настройки указанные локально при запуске кнопки 
Получение настроек (конвертация текста из блока в json) из div c ``id="probtn_additional_params"``
Получение настроек из json-файла с настройками кнопки (в этом случае обращение к серверу за настройками не происходит)
Получение настроек от сервера (``admin.probtn.com``) - основной и наиболее широко используемый и удобный способ

Список используемых параметров, их описаний и иже с ним доступен в документе Probtn web params

Краткое описание взаимодействия с сервером настроек (``admin.probtn.com``)
--------------------------------------------------------------------------
При запуске скрипта кнопки, происходит следующее:

Производится начальная инициализация, во время которой кнопка делает запрос настроек к admin.probtn.com. Настройки идентифицируются исходя из домена сайта (в частности при запросе в числе прочих передается параметр BundleID с доменом сайта, который автоматически берется из document.domain)

В случае, если указаны настройки способами 1 и 2, и одним из параметров указан параметр domain c идентификатором\"доменом", соответствующим одному из "аппов" в ``admin.probtn.com``, то скрипт кнопки при обращении к серверу в ``BundleID`` передаст указанный параметр и получит для него настройки. Это бывает полезно в различных случаях, к примеру когда кнопка с искомыми настройками должна показываться на нескольких сайтах, или же наоборот, когда на одном сайте нужно показать различные рекламные кампании (данный вариант возможен и с использованием campaign в "аппе", но не всегда подходит).

В случае, если апп (и его кампании) выключены, от сервера придет ответ о том что кнопка выключена, и соответственно кнопка показана не будет, и не будет производить дальнейшую инициализацию.

В случае, если аппа с указанным bundleId\"доменом" не существует, будет возвращена ошибка, и кнопка опять таки не будет производить дальнейшую инициализацию.

Интеграция со сторонними сервисами
----------------------------------
Документация

* AdRiver - интеграция с Adriver
* AdRiver  - интеграция с AdRiverс указанием кастомного домена
* AdRiver javascriptJavaScript - интеграция с AdRiver для баннера javascript/JavaScript
* AdFox - интеграция с AdFox
* AdFox  - интеграция с AdFox с указанием кастомного домена
* Probtn working with DFP Google ads - интеграция с DFP

Описание используемых вариантов
-------------------------------
Как видно из приведенных выше вариантов интеграции, зачастую используется 
* http://cdn.probtn.com/includepb.min.js
* http://cdn.probtn.com/showinparent.js
* http://cdn.probtn.com/probtn_concat.js
* http://cdn.probtn.com/showinparent_concat.js

includepb.min.js
^^^^^^^^^^^^^^^^
Данный скрипт добавляет необходимые дополнительные библиотеки на страницу, если необходимо, и инициализирует запуск кнопки.

showinparent.js 
^^^^^^^^^^^^^^^
Данный скрипт добавляет ``includepb.min.js`` на страницу родителя (если страница, где добавлен код, и так является window.top - то код ``includepb.min.js`` будет просто добавлен на нее).

Для того, чтобы скрипт мог добавить ``includepb.min.js`` для родителя, iframe и родитель должны на одном и том же домене (в ином случае в связи c ``cross domain policy``) - для чего в инструкциях есть пункт по созданию html страницы с showinparent.js скриптом.

probtn_concat.js
^^^^^^^^^^^^^^^^
Данный скрипт добавляет необходимые дополнительные библиотеки на страницу, если необходимо, и инициализирует запуск кнопки.
Все нужные для работы кнопки кнопки добавлены в этом файле и добавляются к собственной версии jQuery, запускаемой c ``jQuery.noConflict(true)``

showinparent_concat.js 
^^^^^^^^^^^^^^^^^^^^^^
Данный скрипт добавляет probtn_concat.js на страницу родителя (если страница, где добавлен код, и так является ``window.top`` - то код ``includepb.min.js`` будет просто добавлен на нее).

Для того, чтобы скрипт мог добавить ``probtn_concat.js`` для родителя, iframe и родитель должны на одном и том же домене (в ином случае в связи c ``cross domain policy``) - для чего в инструкциях есть пункт по созданию html страницы с ``showinparent_concat.js`` скриптом.


Объединенный probtn
=======================
Общее описание
----------------
На cdn доступен 
``cdn.probtn.com/probtn_concat.js``
объединенный из всех необходимы библиотек (fancybox, jquery.pep, uaparser), jquery, probtn и includepb.
Кроме собственно объединения кода всех нужных библиотек в файле, также делается следующее - запускается свой jquery (с ``jQuery.noConflict(true)`` для восстановления предыдущего состояния), для которого и добавляются наши библиотеки и собственно probtn, и таким образом не влияющие на какие-либо плагины присутствующие на сайте (к примеру используемый на сайте свой fancybox).

Также создан  
``cdn.probtn.com/showinparent_concat.js``

Описание сборки
--------------------
В репозитории ``probtn/cdn`` при ``precommit`` происходит следующее:
На основе ``src/probtn_concat_template.js`` шаблона происходит сборка в файл ``probtn_concat_full.js``
(замена в файле строк include "path_to_file") посредством 

Далее probtn_concat_full.js минифицируется посредством ``grunt-contrib-uglify`` в ``probtn_concat.js``



