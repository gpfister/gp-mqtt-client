# Change Log

## v1.0.0 - Apr. 30th, 2023

## v0.2.0 - Jan. 5th, 2022

Breaking changes:

-   `listen` command is now `sub`

New features:

-   New `pub` command to publish a message on a topic
-   `sub` command: add an option (`-b` / `--base64`) to apply base64 decoded on
    messages
-   `sub` command: add an option (`-j` / `--json`) to format out put as pretty
    json
-   `sub` command: add an option (`-l` / `--listen`) to keep listening for new
    messages
-   `sub` command: add an option (`-o` / `--output`) to output messages as file in
    a given folder
-   Add an option (`-v` | `--verbose`) to output info message
-   Add an option (`-d` | `--debug`) to output debug message

Improvements:

-   Improve console output

## v0.1.0 - First release

-   Connect to Mosquitto MQTT Server without any credentials (only supported mode)
-   `listen` command to listen a MQTT topic and output the plain text the result
