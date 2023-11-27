<?php
namespace verbb\formie\fields\formfields;

use verbb\formie\Formie;
use verbb\formie\base\FormField;
use verbb\formie\base\Integration;
use verbb\formie\base\IntegrationInterface;
use verbb\formie\elements\Submission;
use verbb\formie\helpers\SchemaHelper;
use verbb\formie\models\HtmlTag;
use verbb\formie\models\Notification;
use verbb\formie\models\PaymentField as PaymentFieldModel;
use verbb\formie\options\Currencies;

use Craft;
use craft\base\ElementInterface;
use craft\helpers\Html;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\helpers\Template;

use Twig\Markup;

class Payment extends FormField
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('formie', 'Payment');
    }

    public static function getSvgIconPath(): string
    {
        return 'formie/_formfields/payment/icon.svg';
    }


    // Properties
    // =========================================================================

    public ?string $paymentIntegration = null;
    public ?string $paymentIntegrationType = null;
    public ?array $providerSettings = [];


    // Public Methods
    // =========================================================================

    public function init(): void
    {
        parent::init();

        // FormKit doesn't handle reactivity for nested arrays properly when empty. So ensure each providers settings
        // are prepped if they're totally fresh.
        $integrations = Formie::$plugin->getIntegrations()->getAllIntegrationsForType(Integration::TYPE_PAYMENT);

        foreach ($integrations as $integration) {
            if (!isset($this->providerSettings[$integration->getHandle()])) {
                // Just have to provide _something_ here
                $this->providerSettings[$integration->getHandle()] = [
                    'integration' => get_class($integration),
                ];
            }
        }
    }

    public function normalizeValue(mixed $value, ElementInterface $element = null): mixed
    {
        $value = parent::normalizeValue($value, $element);
        $value = Json::decodeIfJson($value);

        if ($value instanceof PaymentFieldModel) {
            return $value;
        }

        $model = ($value) ? new PaymentFieldModel($value) : new PaymentFieldModel();
        $model->setElement($element);

        return $model;
    }

    public function getPreviewInputHtml(): string
    {
        return Craft::$app->getView()->renderTemplate('formie/_formfields/payment/preview', [
            'field' => $this,
        ]);
    }

    public function getPaymentHtml(array $renderOptions = []): Markup
    {
        $integration = $this->getPaymentIntegration();

        if (!$integration) {
            return Template::raw('');
        }

        return Template::raw($integration->getFrontEndHtml($this, $renderOptions));
    }

    public function getFrontEndJsModules(): ?array
    {
        $integration = $this->getPaymentIntegration();

        return $integration?->getFrontEndJsVariables($this);
    }

    public function getFrontEndSubFields($context): array
    {
        $integration = $this->getPaymentIntegration();

        return $integration?->getFrontEndSubFields($this, $context);
    }

    public function getPaymentIntegration(): ?IntegrationInterface
    {
        if (!$this->paymentIntegration) {
            return null;
        }

        return Formie::$plugin->getIntegrations()->getIntegrationByHandle($this->paymentIntegration);
    }

    public function beforeSave(bool $isNew): bool
    {
        if (!parent::beforeSave($isNew)) {
            return false;
        }

        if ($this->getPaymentIntegration()) {
            $this->paymentIntegrationType = get_class($this->getPaymentIntegration());
        }
        
        return true;
    }

    public function defineGeneralSchema(): array
    {
        return [
            SchemaHelper::labelField(),
            SchemaHelper::selectField([
                'label' => Craft::t('formie', 'Payment Provider'),
                'help' => Craft::t('formie', 'Select which payment provider this field should use.'),
                'name' => 'paymentIntegration',
                'validation' => 'required',
                'required' => true,
                'options' => array_merge(
                    [['label' => Craft::t('formie', 'Select an option'), 'value' => '']],
                    $this->_getPaymentOptions()
                ),
            ]),
            [
                '$formkit' => 'group',
                'name' => 'providerSettings',
                'children' => $this->_getProviderSettings('defineGeneralSchema'),
            ],
        ];
    }

    public function defineSettingsSchema(): array
    {
        return [
            SchemaHelper::lightswitchField([
                'label' => Craft::t('formie', 'Required Field'),
                'help' => Craft::t('formie', 'Whether this field should be required when filling out the form.'),
                'name' => 'required',
            ]),
            SchemaHelper::textField([
                'label' => Craft::t('formie', 'Error Message'),
                'help' => Craft::t('formie', 'When validating the form, show this message if an error occurs. Leave empty to retain the default message.'),
                'name' => 'errorMessage',
                'if' => '$get(required).value',
            ]),
            [
                '$formkit' => 'group',
                'name' => 'providerSettings',
                'children' => $this->_getProviderSettings('defineSettingsSchema'),
            ],
        ];
    }

    public function defineAppearanceSchema(): array
    {
        return [
            SchemaHelper::visibility(),
            SchemaHelper::labelPosition($this),
            SchemaHelper::instructions(),
            SchemaHelper::instructionsPosition($this),
            [
                '$formkit' => 'group',
                'name' => 'providerSettings',
                'children' => $this->_getProviderSettings('defineAppearanceSchema'),
            ],
        ];
    }

    public function defineAdvancedSchema(): array
    {
        return [
            SchemaHelper::handleField(),
        ];
    }

    public function defineConditionsSchema(): array
    {
        return [
            SchemaHelper::enableConditionsField(),
            SchemaHelper::conditionsField(),
        ];
    }

    public function defineHtmlTag(string $key, array $context = []): ?HtmlTag
    {
        $integration = $this->getPaymentIntegration();

        if (!$integration) {
            return null;
        }

        return $integration->defineHtmlTag($key, $context) ?? parent::defineHtmlTag($key, $context);
    }


    // Protected Methods
    // =========================================================================

    protected function inputHtml(mixed $value, ?ElementInterface $element, bool $inline): string
    {
        return Craft::$app->getView()->renderTemplate('formie/_formfields/payment/input', [
            'name' => $this->handle,
            'value' => $value,
            'field' => $this,
        ]);
    }

    protected function defineValueAsString($value, ElementInterface $element = null): string
    {
        if (is_array($value) || is_object($value)) {
            return Json::encode($value);
        }

        return (string)$value;
    }


    // Private Methods
    // =========================================================================

    private function _getPaymentOptions(): array
    {
        $paymentProviderOptions = [];
        $paymentProviders = Formie::$plugin->getIntegrations()->getAllIntegrationsForType(Integration::TYPE_PAYMENT);

        foreach ($paymentProviders as $paymentProvider) {
            if ($paymentProvider->getEnabled()) {
                $paymentProviderOptions[] = ['label' => $paymentProvider->getName(), 'value' => $paymentProvider->getHandle()];
            }
        }

        return $paymentProviderOptions;
    }

    private function _getProviderSettings($schemaGroup): array
    {
        $schemas = [];

        $integrations = Formie::$plugin->getIntegrations()->getAllIntegrationsForType(Integration::TYPE_PAYMENT);

        foreach ($integrations as $integration) {
            if (method_exists($integration, $schemaGroup)) {
                $schemas[] = [
                    '$formkit' => 'group',
                    'name' => $integration->getHandle(),
                    'children' => $integration->$schemaGroup(),
                    'if' => '$get(paymentIntegration).value == ' . $integration->getHandle(),
                ];
            }
        }

        return $schemas;
    }
}
