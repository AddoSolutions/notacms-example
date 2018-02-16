const express = require('express');
const expressNunjucks = require('express-nunjucks'); // Use Nunjucks, it's nice :)
const NotaCMS = require("notacms");
const config = require("./config" + (process.env.APP_DEV ? "-dev" : ""));
const requireGlob = require('require-glob')
const PageModel = require("./lib/pageModel");
const gulp = require("./gulpfile");

const isDev = process.env.APP_DEV; // If you add this it will go to production mode

if(isDev) console.log(" -- DEVELOPMENT MODE --");

async function main() {
    try {

        // Get express kicked off, load models, and configure notacms.
        const app = express(); // Create the express app
        const models = await requireGlob(['lib/models/*.js'])

        const notaCMS = new NotaCMS({ // Configure the application
            "source": {
                "source": "contentful",     // Which service you will be retreiving data from (right now just contentful)
                "options": {
                    "space": config.space,          // Enter the spaceID for the given contentful space (ex: l6venjzzzzzz)
                    "accessToken": config.accessToken,    // The API access token
                    "logger": function (level, data) {
                        console.log(level + ": " + data); // Your own custom logging method
                    }
                },
            },
            "cache": {
                "method": "mongodb",    // What method would you like to use for your sync?
                "options": {
                    "connection": config.mongo // The mongoDB connection string
                }
            },
            "beforeContent": async (collection, record) => {
                if (models[collection]) {
                    return new models[collection](record);
                } else {
                    return record;
                }
            }
        });

        // Get gulp doing it's thang
        gulp.less();
        if(isDev) gulp.watch();

        // Uncomment this to force a full sync
        // await notaCMS.sync();

        // Here we just get the cached content variable. This object will always have the latest content
        var content = await notaCMS.getContent();


        // Check if we need an initial sync (if this is your first time running and ther eare no pages)
        if (!content.page) {
            await notaCMS.sync();
            await notaCMS.getContent();
        }


        // Configure static resources directory
        app.use(express.static('./static'))
        app.use('/modules', express.static('./node_modules'))
        app.set('views', './templates');

        // Configure the nunjucks templating engine for use with express
        const njk = expressNunjucks(app, {
            watch: isDev,
            noCache: isDev
        });

        // This allows you to have your own api hook to bounce the cached content
        app.post('/appsync', async function (req, res) {
            notaCMS.sync();
            res.json({success: true});
        });


        // Otherwise we catch all requests here
        app.get('*', async function (request, response, next) {
            try {
                // Make sure we have the latest content (in most cases it just returns a cached variable).
                await notaCMS.getContent();

                // Now we set some basic connvenience variables
                var url = request.path;
                var selectedPage = false;

                // In 4 lines we determine if we have a routable page here
                for (var type in content) {
                    selectedPage = content[type].find(c => c instanceof PageModel && c.matchesUrl(url))
                    if (selectedPage) break;
                }

                // If we couldn't find the page, pass along to another router (then 404)
                if (!selectedPage) {
                    next();
                    return;
                }

                // Should re redirect? If so, then we will do so here
                if (selectedPage.getRedirect(url, request)) {
                    var redirect = selectedPage.getRedirect();
                    return response.redirect(redirect.code, redirect.location);
                }

                // Render the page, and add content and page to the view for usage
                return response.render(selectedPage.getTemplateFile(), {
                    content: content,
                    page: selectedPage
                });
            } catch (e) {
                console.error(e);
            }

        });

        // Listen on port 8000
        // This is good to use in general, as in production you will forward using docker
        app.listen(8000);

        console.log("Express: Application listening on port 8000");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

try {
    main();
} catch (e) {
    console.error(e);
}