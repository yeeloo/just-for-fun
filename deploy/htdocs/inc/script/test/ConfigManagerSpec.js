define(["require", "exports", 'lib/temple/config/ConfigManager'], function (require, exports, ConfigManager) {
    var config = {
        "environments": {
            "live": {
                "vars": {
                    "base": "{protocol}//clients.vellance.net/"
                },
                "urls": {
                    "api_url": { "url": "{base}api/flapi.php" },
                    "api_url_plain": "{base}api/flapi.php"
                },
                "properties": {
                    "facebook_appid": "123456789",
                    "linkedin_apikey": ""
                }
            },
            "staging": {
                "extends": "live",
                "vars": {
                    "base": "{protocol}//staging.vellance.net/"
                }
            },
            "development": {
                "extends": "staging",
                "vars": {
                    "base": "{protocol}//devmonks.vellance.net/"
                }
            },
            "local": {
                "extends": "development",
                "vars": {
                    "base": ""
                }
            }
        },
        "vars": {
            protocol: document.location.protocol,
            string: 'string',
            number: 12345,
            boolean_true: true,
            boolean_false: false,
            replace: '{string}{number}{boolean_true}{boolean_false}{custom_1}{custom_2}{custom_unknown}'
        },
        "urls": {
            "api_url": { "url": "{base}api/flapi.php" },
            "facebook_channelurl": { "url": "{base}channel.html" },
            replace: '{string}{number}{boolean_true}{boolean_false}{custom_1}{custom_2}{custom_unknown}'
        },
        "properties": {
            "defaultLocale": "en_GB",
            number: 12345,
            boolean_true: true,
            boolean_false: false
        }
    };
    describe('ConfigManager', function () {
        beforeEach(function () {
            ConfigManager.getInstance().init({
                config: JSON.parse(JSON.stringify(config)),
                environment: 'development'
            });
        });
        it('should return the correct environment', function () {
            expect(ConfigManager.getInstance().getEnvironment()).toBe('development');
        });
        it('should return the correct merged environment', function () {
            expect(ConfigManager.getInstance().getConfig()['extends']).toBe('staging');
        });
        it('should return the correct protocol var', function () {
            expect(ConfigManager.getInstance().getVar('protocol')).toBe(document.location.protocol);
        });
        it('should return the correct base var with replaced variables', function () {
            expect(ConfigManager.getInstance().getVar('base')).toBe(document.location.protocol + '//devmonks.vellance.net/');
        });
        it('should return the new base var', function () {
            ConfigManager.getInstance().setVar('base', '{protocol}//test.com/');
            expect(ConfigManager.getInstance().getVar('base')).toBe(document.location.protocol + '//test.com/');
        });
        it('should return the correct replace var with replaced variables', function () {
            expect(ConfigManager.getInstance().getVar('replace')).toBe('string12345truefalse{custom_1}{custom_2}{custom_unknown}');
        });
        it('should return the correct replace var with replaced variables from getUrl', function () {
            expect(ConfigManager.getInstance().getUrl('replace', { custom_1: 'c1', custom_2: 234 })).toBe('string12345truefalsec1234{custom_unknown}');
        });
        it('should return the correct defaultLocale property', function () {
            expect(ConfigManager.getInstance().getProperty('defaultLocale')).toBe('en_GB');
        });
        it('should return the correct facebook_appid property with replaced variables', function () {
            expect(ConfigManager.getInstance().getProperty('facebook_appid')).toBe('123456789');
        });
        it('should return the correct type', function () {
            expect(typeof ConfigManager.getInstance().getProperty('number')).toBe('number');
            expect(typeof ConfigManager.getInstance().getProperty('boolean_true')).toBe('boolean');
            expect(typeof ConfigManager.getInstance().getProperty('boolean_false')).toBe('boolean');
        });
        it('should return the correct api_url url as object', function () {
            expect(ConfigManager.getInstance().getUrl('api_url')).toBe(document.location.protocol + '//devmonks.vellance.net/api/flapi.php');
        });
        it('should return the correct api_url url as string', function () {
            expect(ConfigManager.getInstance().getUrl('api_url_plain')).toBe(document.location.protocol + '//devmonks.vellance.net/api/flapi.php');
        });
    });
});
