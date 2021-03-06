/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import * as jsonValidator from '../json/validator';
import * as object from '../utilities/object';

// JSON schema formats:
const TOPIC_IDENTIFIER = '([a-z][+a-zA-Z0-9]*|[A-Z][+A-Z0-9]*)';
const SUB_TOPIC_FORMAT = new RegExp( '^' + TOPIC_IDENTIFIER + '$' );
const TOPIC_FORMAT = new RegExp( '^(' + TOPIC_IDENTIFIER + '(-' + TOPIC_IDENTIFIER + ')*)$' );
const FLAG_TOPIC_FORMAT = new RegExp( '^[!]?(' + TOPIC_IDENTIFIER + '(-' + TOPIC_IDENTIFIER + ')*)$' );
// simplified RFC-5646 language-tag matcher with underscore/dash relaxation:
// the parts are: language *("-"|"_" script|region|constiant) *("-"|"_" extension|privateuse)
const LANGUAGE_TAG_FORMAT = /^[a-z]{2,8}([-_][a-z0-9]{2,8})*([-_][a-z0-9][-_][a-z0-9]{2,8})*$/i;

///////////////////////////////////////////////////////////////////////////////////////////////////////////

export function featuresForWidget( widgetSpecification, widgetConfiguration, throwError ) {
   if( !widgetSpecification.features || Object.keys( widgetSpecification.features ).length === 0 ) {
      return {};
   }

   const featureConfiguration = widgetConfiguration.features || {};
   const featuresSpec = widgetSpecification.features;
   // if( !( '$schema' in featuresSpec ) ) {
   //    // we assume an "old style" feature specification (i.e. first level type specification is omitted)
   //    // if no schema version was defined.
   //    featuresSpec = {
   //       $schema: 'http://json-schema.org/draft-03/schema#',
   //       type: 'object',
   //       properties: widgetSpecification.features
   //    };
   // }
   const validator = createFeaturesValidator( featuresSpec );

   object.forEach( featuresSpec.properties, function( feature, name ) {
      // ensure that simple object/array features are at least defined
      if( name in featureConfiguration ) {
         return;
      }

      if( feature.type === 'object' ) {
         featureConfiguration[ name ] = {};
      }
      else if( feature.type === 'array' ) {
         featureConfiguration[ name ] = [];
      }
   } );

   const report = validator.validate( featureConfiguration );

   if( report.errors.length > 0 ) {
      let message = 'Validation for widget features failed. Errors: ';

      report.errors.forEach( function( error ) {
         message += '\n - ' + error.message.replace( /\[/g, '\\[' );
      } );

      throwError( message );
   }

   return featureConfiguration;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function createFeaturesValidator( featuresSpec ) {
   const validator = jsonValidator.create( featuresSpec, {
      prohibitAdditionalProperties: true,
      useDefault: true
   } );

   // allows 'mySubTopic0815', 'MY_SUB_TOPIC+OK' and constiations:
   validator.addFormat( 'sub-topic', function( subTopic ) {
      return ( typeof subTopic !== 'string' ) || SUB_TOPIC_FORMAT.test( subTopic );
   } );

   // allows 'myTopic', 'myTopic-mySubTopic-SUB_0815+OK' and constiations:
   validator.addFormat( 'topic', function( topic ) {
      return ( typeof topic !== 'string' ) || TOPIC_FORMAT.test( topic );
   } );

   // allows 'myTopic', '!myTopic-mySubTopic-SUB_0815+OK' and constiations:
   validator.addFormat( 'flag-topic', function( flagTopic ) {
      return ( typeof flagTopic !== 'string' ) || FLAG_TOPIC_FORMAT.test( flagTopic );
   } );

   // allows 'de_DE', 'en-x-laxarJS' and such:
   validator.addFormat( 'language-tag', function( languageTag ) {
      return ( typeof languageTag !== 'string' ) || LANGUAGE_TAG_FORMAT.test( languageTag );
   } );

   // checks that object keys have the 'topic' format
   validator.addFormat( 'topic-map', function( topicMap ) {
      return ( typeof topicMap !== 'object' ) || Object.keys( topicMap ).every( function( topic ) {
         return TOPIC_FORMAT.test( topic );
      } );
   } );

   // checks that object keys have the 'language-tag' format
   validator.addFormat( 'localization', function( localization ) {
      return ( typeof localization !== 'object' ) || Object.keys( localization ).every( function( tag ) {
         return LANGUAGE_TAG_FORMAT.test( tag );
      } );
   } );

   return validator;
}
