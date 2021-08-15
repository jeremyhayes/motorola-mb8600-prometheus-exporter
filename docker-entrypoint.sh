#! /bin/sh

# Usage: read_secret 'SOME_VAR'
# Will check for existence of SOME_VAR_FILE and 
# read the contents into SOME_VAR
read_secret() {
    local var="$1"
    local fileVar="${var}_FILE"

    # busybox/ash doesn't support a bunch of conditon stuff
    # this is what i could get to work :(
    local val=$(printenv $var)
    local fileVal=$(printenv $fileVar)

    # if both the variable and the xxx_FILE variant exist
    # throw an error
    if [ -n "$val" ] && [ -n "$fileVal" ]; then
        >&2 echo "Both $var and $fileVar are set (but are exclusive)"
        exit 1
    fi

    # if the xxx_FILE variant exists
    # overwrite the base variable
    # then unset the secret
    if [ -n "$fileVal" ]; then
        export "$var"="$(cat $fileVal )"
        unset "$fileVar"
    fi
}

# prepare docker secrets
read_secret 'MODEM_BASE_URL'
read_secret 'MODEM_USERNAME'
read_secret 'MODEM_PASSWORD'

node server.js
